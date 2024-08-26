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
        command: "/create",
        description: "Create Meme Coin.",
        params: { url: {
            default: "", // Default value
            type: "string", // This will parse it to a number
        },}
    }
    ],
  },
  
];