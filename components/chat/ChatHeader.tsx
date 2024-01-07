import { Hash, Menu } from "lucide-react";
import React from "react";
import MobileToggle from "../MobileToggle";
import UserAvatar from "../UserAvatar";
import SocketIndicator from "../SocketIndicator";

type ChatHeaderType = {
  serverId: string;
  name: string;
  imageUrl?: string;
  type: "channel" | "conversation";
};
const ChatHeader = ({ serverId, name, imageUrl, type }: ChatHeaderType) => {
  return (
    <div
      className="flex items-center gap-x-2 border-b-2 px-3 h-12 
    border-neutral-200 dark:border-neutral-700 text-sm font-medium"
    >
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === "conversation" && (
        <UserAvatar className="w-6 h-6 md:w-8 md:h-8 mr-2" src={imageUrl!} />
      )}
      <p className="text-base font-semibold text-zinc-700 dark:text-slate-50">
        {name}
      </p>

      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
