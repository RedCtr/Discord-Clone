"use client";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useModalStore from "@/hooks/useModalStore";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LeaveServerModal() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModalStore();

  const isModalOpen = isOpen && type === "leaveServer";

  const onClick = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/server/${server?.id}/leave`);

      onClose();
      router.refresh();
      router.push("/");
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
            Leave the Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-400">
            Are you sure you want to leave{" "}
            <span className="font-semibold text-indigo-400">
              {" "}
              {server?.name}
            </span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="px-6 py-5 bg-gray-100">
          <div className="flex items-center justify-between w-full ">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>

            <Button
              disabled={isLoading}
              onClick={onClick}
              className="bg-rose-500 hover:bg-rose-500/80 text-slate-50"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
