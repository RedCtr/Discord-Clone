import ChatHeader from "@/components/chat/ChatHeader";
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  );
};

export default Conversation;
