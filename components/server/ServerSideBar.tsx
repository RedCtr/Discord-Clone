import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./ServerHeader";

const ServerSideBar = async ({ serverId }: { serverId: string }) => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );
  // You don't need to show yourself with memebers
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col w-full h-full text-primary bg-[#F2F3F5] dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSideBar;
