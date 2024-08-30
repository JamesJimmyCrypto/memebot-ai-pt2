import { run, HandlerContext, CommandHandlers } from "@xmtp/message-kit";
import { commands } from "./commands.js";
import {handler as  send } from "./send.js";
import {handler as  help } from "./help.js";
import {handler as  create } from "./create.js";
import { contractABI,contractAddress } from "./contracts/contracts.js";
import {ethers} from "ethers"

import  'dotenv/config';


//Track 
const inMemoryCacheStep = new Map<string, number>();

let x=1974;
async function _create(context: HandlerContext,signer:any) {
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

 const transaction =   await contract.startSession(`list 5 meme coin ideas based on ${prompt}.  list in the name sybmol and description list then in a json array
`)

const receipt = await signer.provider.getTransactionReceipt(transaction.hash);

console.log(receipt)
const iface = new ethers.utils.Interface(contractABI);
console.log(iface)

const events = iface.parseLog(receipt.logs[1]);
console.log(events)
    inMemoryCacheStep.set(sender.address,1);
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
  ///context.send(commandText)
  const privateKey = process.env.NEXT_PUBLIC_KEY;

  let wallet = new ethers.Wallet(privateKey as string)

  const provider = new ethers.providers.JsonRpcProvider(
  "https://devnet.galadriel.com/"  );
  let signer = wallet.connect(provider);
  switch (commandText) {
    case "/help":
    context.send(x.toString()); 
    x++;

    // await context.intent(text);
      break;
    
      case "/create":

      //await context.intent(text);
      if(inMemoryCacheStep.get(sender.address) == 0 ||  inMemoryCacheStep.get(sender.address)==undefined)
        _create(context,signer);
      else
         context.send("Create command already called. Please select coin");
      break;

      case "/finalize":
        //await context.intent(text);
        inMemoryCacheStep.set(sender.address,0);
      break;
      case "/send":
        await context.intent(text);
        break; 
    // Add more cases as needed
    default:
      await context.intent("/help");
  } 


}