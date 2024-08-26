import { run, HandlerContext, CommandHandlers } from "@xmtp/message-kit";
import { commands } from "./commands";
import {handler as  send } from "./send";
import {handler as  help } from "./help";

const commandHandlers: CommandHandlers = {
  "/send": send,
  "/help":help
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
 
  if (text.startsWith("/")) {
    await context.intent(text);
  }
}