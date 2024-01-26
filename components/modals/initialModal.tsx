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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useEffect, useState } from "react";
import FileUpload from "../FileUpload";

const formSchema = z.object({
  serverName: z.string().min(1, {
    message: "Server name is required.",
  }),
  imageUrl: z.string().min(1, {
    message: "Server image is required.",
  }),
});
export function InitialModal() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/server", values);

      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog open>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Create a Server</Button>
      </DialogTrigger> */}
      <DialogContent className=" bg-slate-50 text-black p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-7">
          <DialogTitle className="text-lg lg:text-2xl text-center font-bold">
            Create your Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            {"Make changes to your profile here. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="px-5 space-y-8">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-sm text-zinc-500 dark:text-secondary/80">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Enter the Server Name"
                        className="bg-zinc-300/50 focus-visible:ring-0 focus-visible:ring-offset-0 border-0 text-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="px-4 py-3 bg-gray-100">
              <Button variant="primary" disabled={isLoading} type="submit">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
