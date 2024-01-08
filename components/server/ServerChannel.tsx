"use client";
import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import useModalStore, { ModalType } from "@/hooks/useModalStore";

type ServerChannelType = {
  channel: Channel;
  role?: MemberRole;
  server: Server;
};

const IconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, role, server }: ServerChannelType) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModalStore();
  const Icon = IconMap[channel.type];

  const onChannelClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={onChannelClick}
      className={cn(
        "flex items-center gap-x-2 px-2 py-2 w-full rounded-md mb-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-colors group",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <Icon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          "text-sm font-medium line-clamp-1 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors",
          params?.channelId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="Edit" side="top">
            <Edit
              onClick={(e) => onAction(e, "editChannel")}
              className="w-4 h-4 hidden group-hover:block 
                    text-zinc-500 hover:text-zinc-600 
                    dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
            />
          </ActionTooltip>

          <ActionTooltip label="Delete" side="top">
            <Trash
              onClick={(e) => onAction(e, "deleteChannel")}
              className="w-4 h-4 hidden group-hover:block 
                    text-zinc-500 hover:text-zinc-600 
                    dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock
          className="ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 
                    dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
        />
      )}
    </button>
  );
};

export default ServerChannel;
