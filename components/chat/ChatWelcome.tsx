import { Hash } from "lucide-react";
import React from "react";

type ChatWelcomeType = {
  name: string;
  type: "channel" | "conversation";
};
const ChatWelcome = ({ name, type }: ChatWelcomeType) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div
          className="flex items-center justify-center rounded-full w-[75px] h-[75px]
                bg-zinc-500 dark:bg-zinc-700"
        >
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-semibold">
        {type === "channel" ? "Welcome to # " : ""}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === "channel"
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}`}
      </p>
    </div>
  );
};

export default ChatWelcome;
