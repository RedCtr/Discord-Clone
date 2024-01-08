import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import { db } from "@/lib/prisma";
import getOrCreateConversation from "@/utils/conversation";
import currentProfile from "@/utils/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type ConversationType = {
  params: {
    memberId: string;
    serverId: string;
  };
};

const Conversation = async ({ params }: ConversationType) => {
  const profile = await currentProfile();
  if (!profile) {
    redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile?.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }
  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile?.id ? memberTwo : memberOne;
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />

      <ChatMessages
        member={currentMember}
        name={otherMember.profile.name}
        chatId={conversation.id}
        type="conversation"
        apiUrl="/api/directMessages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/directMessages"
        socketQuery={{
          conversationId: conversation.id,
        }}
      />

      <ChatInput
        name={otherMember.profile.name}
        type="conversation"
        apiUrl="/api/socket/directMessages"
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default Conversation;
