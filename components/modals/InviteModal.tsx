"use client";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/useModalStore";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Check, Copy, RefreshCcw } from "lucide-react";
import useOrigin from "@/hooks/useOrigin";

export function InviteModal() {
  const [isLoading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const {
    isOpen,
    onOpen,
    onClose,
    type,
    data: { server },
  } = useModalStore();
  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const inviteCode = `${origin}/invite/${server?.inviteCode}`;

  const onCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const generateNewsInviteLink = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/server/${server?.id}/inviteCode`);
      console.log("res", res.data);

      onOpen("invite", { server: res.data });
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-slate-50 text-black p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-7">
          <DialogTitle className="text-lg lg:text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            {"Invite your friends to come and join your server"}
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          <Label className="text-xs font-semibold uppercase text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="flex items-center gap-x-2 pt-2">
            <Input
              readOnly
              disabled={isLoading}
              value={inviteCode}
              className="focus-visible:ring-0 focus-visible:ring-offset-0 border-0 
            bg-zinc-300/50 text-black"
            />

            <Button onClick={onCopy} size="icon">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <Button
            onClick={generateNewsInviteLink}
            disabled={isLoading}
            size="sm"
            variant="link"
            className="text-indigo-500 text-xs font-medium py-1"
          >
            Generate a new link
            <RefreshCcw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
