"use client";
import { Member, Message, Profile } from "@prisma/client";
import React, { Fragment } from "react";
import ChatWelcome from "./ChatWelcome";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import useChatSocket from "@/hooks/useChatSocket";

type ChatMessagesType = {
  member: Member;
  name: string;
  chatId: string;
  type: "channel" | "conversation";
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";
const ChatMessages = ({
  member,
  name,
  chatId,
  type,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
}: ChatMessagesType) => {
  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  // adding Chat Socket hook for realtime update message
  useChatSocket({ queryKey, addKey, updateKey });

  if (status === "pending") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-screen">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-3" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages ...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-screen">
        <ServerCrash className="w-7 h-7 text-zinc-500 my-3" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong ... !
        </p>
      </div>
    );
  }

  console.log("data", data?.pages);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto py-4 ">
      <div className="flex-1" />
      <ChatWelcome name={name} type={type} />

      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                fileUrl={message.fileUrl}
                currentMember={member}
                member={message.member}
                deleted={message.deleted}
                isUpdated={message.createdAt !== message.updatedAt}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;
