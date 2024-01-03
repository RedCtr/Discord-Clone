"use client";
import { ServerWithMembersAndProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from "lucide-react";

type ServerHeaderType = {
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
};
const ServerHeader = ({ server, role }: ServerHeaderType) => {
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="flex items-center w-full h-12 text-sm line-clamp-1 truncate font-semibold px-3
        border-neutral-700 dark:border-neutral-800 border-b-2 transition-colors 
        hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
        >
          {server.name}
          <ChevronDown className="ml-auto w-5 h-5" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-500 space-y-[2px]">
        {isModerator && (
          <DropdownMenuItem className="text-indigo-500 dark:text-indigo-400 px-3 py-2 cursor-pointer text-sm">
            Invite People
            <UserPlus className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm">
            Server Settings
            <Settings className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm">
            Manage Members
            <Users className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem className="px-3 py-2 cursor-pointer text-sm">
            Create Channel
            <PlusCircle className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 cursor-pointer text-sm">
            Delete Server
            <Trash className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500 px-3 py-2 cursor-pointer text-sm">
            Leave Server
            <LogOut className="w-4 h-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
