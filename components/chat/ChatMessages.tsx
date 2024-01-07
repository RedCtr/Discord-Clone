"use client";
import { Member, Message, Profile } from "@prisma/client";
import React, { ElementRef, Fragment, useRef } from "react";
import ChatWelcome from "./ChatWelcome";
import useChatQuery from "@/hooks/useChatQuery";
import { Loader2, ServerCrash } from "lucide-react";
import ChatItem from "./ChatItem";
import { format } from "date-fns";
import useChatSocket from "@/hooks/useChatSocket";
import useChatScroll from "@/hooks/useChatScroll";

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

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  // adding Chat Socket hook for realtime update message
  useChatSocket({ queryKey, addKey, updateKey });

  useChatScroll({
    chatRef,
    bottomRef,
    shouldLoadMore: !!hasNextPage && !isFetchingNextPage,
    loadMore: fetchNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

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

  return (
    <div
      ref={chatRef}
      className="flex-1 flex flex-col h-screen overflow-y-auto py-4 "
    >
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome name={name} type={type} />}

      {hasNextPage && (
        <div className="flex  justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="w-6 h-6 text-zinc-500 animate-spin py-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 py-4 text-xs transition-colors"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

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

      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
