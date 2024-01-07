"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useModalStore from "@/hooks/useModalStore";
import { useEffect, useState } from "react";
import { ChannelType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import qs from "query-string";

const formSchema = z.object({
  channelName: z
    .string()
    .min(1, {
      message: "channel name is required.",
    })
    .refine((name) => name !== "general", {
      message: "Channel cannot be named 'general'",
    }),
  type: z.nativeEnum(ChannelType),
});
export function EditChannelModal() {
  const {
    isOpen,
    onClose,
    type,
    data: { server, channel },
  } = useModalStore();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
      type: ChannelType.TEXT,
    },
  });

  const isModalOpen = isOpen && type === "editChannel";

  useEffect(() => {
    if (channel) {
      form.setValue("channelName", channel.name);
      form.setValue("type", channel.type);
    }
  }, [channel, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channel/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.patch(url, values);

      setLoading(false);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className=" bg-slate-50 text-black p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-7">
          <DialogTitle className="text-lg lg:text-2xl text-center font-bold">
            Edit Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="px-5 space-y-8">
              <FormField
                control={form.control}
                name="channelName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-sm text-zinc-500 dark:text-secondary/80">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Enter the Channel Name"
                        className="bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-sm text-zinc-500 dark:text-secondary/80">
                      Channel Type
                    </FormLabel>

                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger
                          className="focus:ring-0 focus:ring-offset-0 ring-offset-0
                      bg-zinc-400/60 text-black capitalize border-0 outline-none"
                        >
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-4 py-3 bg-gray-100">
              <Button
                disabled={isLoading}
                type="submit"
                className="text-white bg-indigo-500 hover:bg-indigo-500/80"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
