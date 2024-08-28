import { HandlerContext, User } from "@xmtp/message-kit";
import { commands } from "./commands.js";

export async function handler(context: HandlerContext) {
    const {
        message: {
          content: { content, params },
        },
      } = context;

      const _commands = commands[0].commands;
      let prompt = ""
      for(let command in _commands){
         prompt += _commands[command].command+"\n";
         prompt += _commands[command].description+"\n";

      }
      context.send(prompt);
}