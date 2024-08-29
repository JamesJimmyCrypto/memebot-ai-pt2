import { run, HandlerContext, CommandHandlers } from "@xmtp/message-kit";
import { commands } from "./commands.js";
import {handler as  send } from "./send.js";
import {handler as  help } from "./help.js";
import {handler as  create } from "./create.js";

//Track 
//const inMemoryCacheStep = new Map<string, number>();


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
    content: { content: text },
  } = context.message;

 let commandText = text.split(' ')[0];
 commandText =  commandText.trim();
  ///context.send(commandText)
 
  switch (commandText) {
    case "/help":
      await context.intent(text);
      break;
    
      case "/create":
      await context.intent(text);
      break;

      case "/finalize":
        await context.intent(text);
      break;
  
    // Add more cases as needed
    default:
      await context.intent("/help");
  } 


}