import { HandlerContext, User } from "@xmtp/message-kit";

export async function handler(context: HandlerContext) {
    const {
        message: {
          content: { content, params },sender
        },
      } = context;

      const { url } = params; 

      context.send(url);
      // Generate URL for the mint transaction
     // let url_create = generateFrameURL(url,  {
       //     });
      //context.send(`${url_create}`);

      //context.reply("You called the send command"+JSON.stringify(params)+JSON.stringify(sender));
}

// Function to generate a URL with query parameters for transactions
function generateFrameURL(
    baseUrl: string,
    params: any,
  ) {
    // Filter out undefined parameters
    let filteredParams: { [key: string]: any } = {};
   
    for (const key in params) {
      if (params[key] !== undefined) {
        filteredParams[key] = params[key];
      }
    }
    let queryParams = new URLSearchParams({
      ...filteredParams,
    }).toString();
    return `${baseUrl}?${queryParams}`;
  }