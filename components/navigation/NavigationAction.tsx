"use client";
import { Plus } from "lucide-react";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import useModalStore from "@/hooks/useModalStore";

const NavigationAction = () => {
  const { onOpen } = useModalStore();
  return (
    <div>
      <ActionTooltip label="add a server" align="center" side="right">
        <button
          onClick={() => onOpen("createServer")}
          className="flex items-center group"
        >
          <div
            className="flex items-center justify-center w-[48px] h-[48px] mx-3 overflow-hidden 
            transition-all rounded-[24px] group-hover:rounded-[15px] bg-background dark:bg-neutral-700 group-hover:bg-emerald-500"
          >
            <Plus
              size={25}
              className="text-emerald-500 group-hover:text-white transition-colors"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
