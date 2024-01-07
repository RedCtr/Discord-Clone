"use client";
import { Member, MemberRole, Profile } from "@prisma/client";
import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import ActionTooltip from "../ActionTooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import queryString from "query-string";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import useModalStore from "@/hooks/useModalStore";

type ChatItemType = {
  id: string;
  content: string;
  fileUrl: string | null;
  member: Member & {
    profile: Profile;
  };
  currentMember: Member;
  timestamp: string;
  deleted: boolean;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const RoleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500 ml-1" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500 ml-1" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatItem = ({
  id,
  content,
  fileUrl,
  member,
  currentMember,
  timestamp,
  deleted,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemType) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const [isEditting, setIsEditing] = useState(false);
  const { onOpen } = useModalStore();
  const router = useRouter();
  const params = useParams();

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isOwner || isAdmin || isModerator);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPdf = fileUrl && fileType === "pdf";
  const isImage = fileUrl && !isPdf;

  const isLoading = form.formState.isSubmitting;

  const onMemberClicked = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  const onMessageUpdated = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, value);

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content, form]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="w-full relative flex items-center p-4 hover:bg-black/5 transition-colors group">
      <div className="flex items-start gap-x-2 group w-full">
        <div
          onClick={onMemberClicked}
          className="cursor-pointer hover:drop-shadow-md transition-shadow"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClicked}
                className="text-sm font-semibold cursor-pointer hover:underline"
              >
                {member.profile.name}
              </p>

              <ActionTooltip label={member.role} side="top">
                {RoleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>

          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square w-48 h-48 rounded-md flex items-center
                mt-2 overflow-hidden bg-secondary"
            >
              <Image
                alt={content}
                src={fileUrl}
                fill
                className="object-cover object-center"
              />
            </a>
          )}

          {isPdf && (
            <div className="flex items-center gap-x-2 relative rounded-md bg-background/10 p-2 my-2">
              <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 dark:text-indigo-400 text-sm hover:underline"
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditting && (
            <div
              className={cn(
                "text-sm text-zinc-600 dark:text-zinc-300",
                deleted &&
                  "italic text-xs text-zinc-500 dark:text-zinc-400 mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:text-zinc-400">
                  (edited)
                </span>
              )}
            </div>
          )}

          {!fileUrl && isEditting && (
            <Form {...form}>
              <form
                className="flex items-center gap-x-2 pt-2 w-full"
                onSubmit={form.handleSubmit(onMessageUpdated)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            {...field}
                            disabled={isLoading}
                            className="w-full rounded-md p-2 bg-zinc-200/80 dark:bg-zinc-700/70
                                      border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  disabled={isLoading}
                  type="submit"
                  size="sm"
                  variant="primary"
                >
                  Save
                </Button>
              </form>

              <span className="mt-1 text-xs text-zinc-400">
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>

      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 absolute -top-2 right-4 p-1
            bg-white dark:bg-zinc-800 border rounded-md"
        >
          {canEditMessage && (
            <ActionTooltip label="Edit" side="top">
              <Edit
                onClick={() => setIsEditing(true)}
                className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition cursor-pointer"
              />
            </ActionTooltip>
          )}

          <ActionTooltip label="Delete" side="top">
            <Trash
              onClick={() =>
                onOpen("deleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="w-4 h-4 text-rose-500 hover:text-rose-600 transition cursor-pointer"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
