import React from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";

import currentProfile from "@/utils/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import ChatMessages from "@/components/chat/ChatMessages";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/MediaRoom";

type ChannelPageType = {
  params: {
    channelId: string;
    serverId: string;
  };
};
const Channel = async ({ params }: ChannelPageType) => {
  const profile = await currentProfile();

  if (!profile) {
    redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile?.id,
    },
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom audio={true} video={false} chatId={channel.id} />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom audio={false} video={true} chatId={channel.id} />
      )}
    </div>
  );
};

export default Channel;
