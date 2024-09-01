import { run, HandlerContext, CommandHandlers } from "@xmtp/message-kit";
import { commands } from "./commands.js";
import {handler as  send } from "./send.js";
import {handler as  help } from "./help.js";
import {handler as  create } from "./create.js";
import { contractABI,contractAddress } from "./contracts/contracts.js";
import {ethers} from "ethers"

import  'dotenv/config';

interface Token {
  
  name:string;
  symbol:string
  description:string;
  
}

let _context:HandlerContext;
 ///context.send(commandText)
 const privateKey = process.env.NEXT_PUBLIC_KEY;

 let wallet = new ethers.Wallet(privateKey as string)

 const provider = new ethers.providers.JsonRpcProvider(
 "https://devnet.galadriel.com/"  );
 let signer = wallet.connect(provider);
 const _contract = new ethers.Contract(contractAddress,contractABI,signer)
  

//Track 
const inMemoryCacheStep = new Map<string, number>();

const inMemoryCacheData = new Map<string, {selected:number,tokens:Token[],images:string[],selectedImage:number}>();
const inMemoryCacheSessionId = new Map<string, number>();

const handleOracleResponse = async(botsessionId:any,user:any,response:string,role:string, responseDate:any)=>{
  console.log(`Oracle Responded ${botsessionId} - ${responseDate}`);
  let code:string="";
  if(role=="assistant")
     code = "<tokens/>"
  if(role=="image")
    code= "<image/>"
  
  if(role=="assistant")
  {
    
    let jsonString = response.replace('json', '');
    jsonString = jsonString.replaceAll("`", '');


    const tokens = JSON.parse(jsonString);
    const formattedItems = tokens.map((item:any) => {
    return `Symbol: ${item.symbol} - Name: ${item.name} \n\n Description:\n${item.description}\n\n`;
  });
  inMemoryCacheData.set(user,{selected:-1,tokens:tokens,images:[],selectedImage:0});

  _context.sendTo(formattedItems,[user]);
}


if(role=="image")
  {
    
    const tokens = inMemoryCacheData.get(user);
    if(tokens)
    {  
    tokens.images.push(response)
    inMemoryCacheData.set(user,tokens);
      _context.sendTo(code+response,[user]);
  } 
}

}


_contract.on('OracleResponse', handleOracleResponse);

async function selectLogo(context: HandlerContext) {
  const {
    message: {
      content: { content, params },sender
    },
  } = context;

  const {choice} = params;
  let tokenData = inMemoryCacheData.get(sender.address);
  if (tokenData)
  
  {  if(choice < tokenData.images.length  || choice > tokenData.images.length)
    {
      context.send(`Error invalid choice.  Choose between 1-${tokenData.images.length}.`);
      return
    }  
      
  inMemoryCacheStep.set(sender.address,4);
  tokenData.selectedImage =  choice;
  inMemoryCacheData.set(sender.address,tokenData);

 
  context.send(`Image selected.`)
  
  }
 
}


async function selectToken(context: HandlerContext) {
  const {
    message: {
      content: { content, params },sender
    },
  } = context;

  const {choice} = params;
  if(choice < 1 || choice > 5)
  {  
    context.send("Error invalid choice.  Choose between 1-5.");
    return;
  }   
  
    inMemoryCacheStep.set(sender.address,2);
  let tokenData = inMemoryCacheData.get(sender.address);
  if(tokenData)

  {
    
    tokenData.selected =  choice;
    inMemoryCacheData.set(sender.address,tokenData);

  
    context.send(`You selected token: ${choice}`)
  
  }
 
}


async function _create(context: HandlerContext) {
  const contract = new ethers.Contract(contractAddress,contractABI,signer)
  const {
    message: {
      content: { content, params },sender
    },
  } = context;
  const { prompt } = params; 
  if(prompt == "" || prompt == undefined)
  {
      context.send("Error: Paramerter prompt not given.");
      return;
  } 

  try
  { 

 const transaction =   await contract.startBotSession(`list 5 meme coin ideas based on ${prompt}.  list in the name sybmol and description list then in a json array
`,sender.address)

await transaction.wait()
const receipt = await signer.provider.getTransactionReceipt(transaction.hash);

console.log(receipt)
const iface = new ethers.utils.Interface(contractABI);
console.log(iface)

const events = iface.parseLog(receipt.logs[1]);
console.log(events)
const botsessionId = events.args[1].toNumber()
console.log(`botsessionId ${botsessionId}`);
    inMemoryCacheStep.set(sender.address,1);
    inMemoryCacheSessionId.set(sender.address,botsessionId)
  }
  catch(error)
  {
     console.log(error);
  }

}

async function createLogo(context: HandlerContext) {
  const contract = new ethers.Contract(contractAddress,contractABI,signer)
  const {
    message: {
      content: { content, params },sender
    },
  } = context;
  
  let tokenData = inMemoryCacheData.get(sender.address);
  let token =  tokenData?.tokens[tokenData.selected-1]
  let sessionId = inMemoryCacheSessionId.get(sender.address)

  try
  { 

 const transaction =   await contract.videobotsessions(`Create a logo for a meme coin named ${token?.name}`,sender.address,sessionId)

    await transaction.wait()
    inMemoryCacheStep.set(sender.address,3);
    
  }
  catch(error)
  {
     console.log(error);
  }

}


async function finalizeSession(context: HandlerContext) {
  const contract = new ethers.Contract(contractAddress,contractABI,signer)
  const {
    message: {
      content: { content, params },sender
    },
  } = context;
  const sessionId = inMemoryCacheSessionId.get(sender.address);
  try
  { 

 const transaction =   await contract.finalizeSession(sessionId)

await transaction.wait()


inMemoryCacheStep.set(sender.address,0);
inMemoryCacheData.set(sender.address,{selected:-1,tokens:[],images:[],selectedImage:0});

  }
  catch(error)
  {
     console.log(error);
  }

}
const commandHandlers: CommandHandlers = {
  "/send": send,
  "/help":help,
  "/create":create
};
 
const appConfig = {
  commands: commands,
  commandHandlers: commandHandlers,
};
 
run(async (context: HandlerContext) => {
  //Your logic here
 _context = context;
  const {
    message: { typeId },
  } = context;
  if(typeId=="text")
    handleTextMessage(context)
}, appConfig);

// Handle text messages
async function handleTextMessage(context: HandlerContext) {
  const {
    message: {
      content: { content: text },
      typeId,
      sender,
    },
  } = context;

 let commandText = text.split(' ')[0];
 commandText =  commandText.trim();
 
  switch (commandText) {
    case "/help":
   
     await context.intent(text);
      break;
    
      case "/create":

      if(inMemoryCacheStep.get(sender.address) == 0 ||  inMemoryCacheStep.get(sender.address)==undefined)
        _create(context);
      else
         context.send("Create command already called. Please select coin");
      break;

      case "/select":
      if(inMemoryCacheStep.get(sender.address) == 1 )
        selectToken(context);
      else
         context.send("Please use create command.");
      
        break; 

        case "/logo":
        if(inMemoryCacheStep.get(sender.address) == 2 )
          createLogo(context);
        else
           context.send("Please select coin.");
        
          break;   
        case "/selectlogo":
        if(inMemoryCacheStep.get(sender.address) == 3 )
          selectLogo(context);
        else
           context.send("Please select coin.");
        
          break;   

      case "/finalize":
        if(inMemoryCacheStep.get(sender.address) == 4 )

        finalizeSession(context)
        else      
        context.send("Meme coin cannot be finalized.");

      break;
     
    // Add more cases as needed
    default:
      await context.intent("/help");
  } 


}