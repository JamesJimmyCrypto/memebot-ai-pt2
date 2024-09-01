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