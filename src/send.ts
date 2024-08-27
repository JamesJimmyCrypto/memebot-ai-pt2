import { HandlerContext, User } from "@xmtp/message-kit";

export async function handler(context: HandlerContext) {
    const {
        message: {
          content: { content, params },sender
        },
      } = context;
      context.send("You called the send command"+JSON.stringify(params)+JSON.stringify(sender));
}