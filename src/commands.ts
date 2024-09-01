import type { CommandGroup } from "@xmtp/message-kit";
 
export const commands: CommandGroup[] = [
  {
    name: "Transactions",
    icon: "💸",
    description: "Multipurpose transaction command.",
    commands: [
     
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
    },
    {
      command: "/logo ",
      description: "Generate logo.",
      params: { }
  },{
      command: "/finalize [network]",
      description: "Send frame to create coin on network. 1 - OP Sepolia 2 -  Galadriel",
      params: { network: {
        default: 1, // Default value
        type: "number", // This will parse it to a number
        }
      }
  },{
    command: "/select [choice]",
    description: "Select or choose token suggestion.",
    params: { choice: {
      default: 1, // Default value
      type: "number", // This will parse it to a number
      }
    }
  },{
    command: "/selectlogo [choice]",
    description: "Select or choose logo.",
    params: { choice: {
      default: 1, // Default value
      type: "number", // This will parse it to a number
      }
    }
  }
    ],
  },
  
];