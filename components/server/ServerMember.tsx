"use client";
import { cn } from "@/lib/utils";
import { Member, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import UserAvatar from "../UserAvatar";

type ServerMemberType = {
  member: Member & { profile: Profile };
  server: Server;
};

const RoleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500 ml-1" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500 ml-1" />,
};

const ServerMember = ({ member, server }: ServerMemberType) => {
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
      onClick={onMemberClick}
      className={cn(
        "flex items-center gap-x-2 px-2 py-2 w-full rounded-md mb-1 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-colors group",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        className="w-6 h-6 md:w-8 md:h-8"
        src={member.profile.imageUrl}
      />

      <p
        className={cn(
          "text-sm font-medium line-clamp-1 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition-colors",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {RoleIconMap[member.role]}
    </button>
  );
};

export default ServerMember;
