import type { CommandGroup } from "@xmtp/message-kit";
 
export const commands: CommandGroup[] = [
  {
    name: "Transactions",
    icon: "💸",
    description: "Multipurpose transaction command.",
    commands: [
      {
        command: "/send [amount] [token] [@username]",
        description:
          "Send a specified amount of a cryptocurrency to a destination address.",
        params: {
          amount: {
            default: 10, // Default value
            type: "number", // This will parse it to a number
          },
          token: {
            default: "usdc", // Default value
            type: "string", // String field always need to specify accepted values
            values: ["eth", "dai", "usdc", "degen"], // Accepted values
          },
          username: {
            default: "", // No default username
            type: "username", // This will parse it to a username array
          },
        },
      },
      {
          command: "/help",
          description: "Get help with the app.",
          params: {}
      },
      {
        command: "/create [prompt]",
        description: "Create Meme Coin.",
        params: { prompt: {
            default: "", // Default value
            type: "string", // This will parse it to a string
        },}
    },{
      command: "/finalize",
      description: "Send Frame to Create Meme Coin.",
      params: { }
  },{
    command: "/select [choice]",
    description: "Select or choose token suggestion.",
    params: { choice: {
      default: 1, // Default value
      type: "number", // This will parse it to a number
      }
    }
  },{
    command: "/selectimage [choice]",
    description: "Select or choose image.",
    params: { choice: {
      default: 1, // Default value
      type: "number", // This will parse it to a number
      }
    }
  }
    ],
  },
  
];