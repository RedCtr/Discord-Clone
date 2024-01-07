"use client";
import { ServerWithMembersAndProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { Plus, Settings } from "lucide-react";
import useModalStore from "@/hooks/useModalStore";

type ServerSectionType = {
  sectionType: "channel" | "member";
  channelType?: ChannelType;
  role?: MemberRole;
  label: string;
  server?: ServerWithMembersAndProfiles;
};
const ServerSection = ({
  sectionType,
  channelType,
  role,
  label,
  server,
}: ServerSectionType) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="uppercase text-xs font-medium text-zinc-500 dark:text-zinc-400 cursor-pointer">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channel" && (
        <ActionTooltip label="Create a Channel" side="top">
          <button
            onClick={() => onOpen("createChannel", { server, channelType })}
            className="text-zinc-500 dark:text-zinc-400 
                    hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "member" && (
        <ActionTooltip label="View Settings" side="top">
          <button
            onClick={() => onOpen("members", { server })}
            className="text-zinc-500 dark:text-zinc-400 
                      hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
