"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import axios from "axios";
import useModalStore from "@/hooks/useModalStore";

import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Plus } from "lucide-react";
import EmojiPicker from "../EmojiPicker";
import { useRouter } from "next/navigation";

type ChatInputType = {
  name: string;
  type: "conversation" | "channel";
  query: Record<string, string>;
  apiUrl?: string;
};

const formSchema = z.object({
  content: z.string().min(1),
});

const ChatInput = ({ name, type, query, apiUrl }: ChatInputType) => {
  const { onOpen } = useModalStore();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onMessageSubmit = async (value: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: apiUrl!,
        query,
      });

      await axios.post(url, value);

      form.reset();
      router.refresh();
      // here you can do an optimistic update
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onMessageSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    className="flex items-center justify-center p-1 absolute top-7 left-8 w-[24px] h-[24px] rounded-full 
                            bg-zinc-500 hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300 transition-colors"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    type="button"
                  >
                    <Plus className="w-4 h-4 text-slate-50 dark:text-[#313338]" />
                  </button>

                  <Input
                    {...field}
                    disabled={isLoading}
                    className="w-full rounded-md px-14 py-6 bg-zinc-200/80 dark:bg-zinc-700/70
                            border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : `# ${name}`
                    }`}
                  />

                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
