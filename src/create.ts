import { HandlerContext, User } from "@xmtp/message-kit";

export async function handler(context: HandlerContext) {
    const {
        message: {
          content: { content, params },sender
        },
      } = context;

      const { description:desc } = params; 


      context.reply("You called the create command with"+JSON.stringify(params));
}

