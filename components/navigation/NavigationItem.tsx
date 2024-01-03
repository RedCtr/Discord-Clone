"use client";
import React from "react";
import ActionTooltip from "../ActionTooltip";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

type NavigationItemType = {
  id: string;
  name: string;
  imageUrl: string;
};
const NavigationItem = ({ id, name, imageUrl }: NavigationItemType) => {
  const params = useParams();
  const router = useRouter();
  return (
    <ActionTooltip label={name} align="center" side="right">
      <button
        onClick={() => router.push(`/servers/${id}`)}
        className="flex items-center relative group"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
            params?.serverId !== id && "group-hover:h-[20px]",
            params?.serverId === id ? "h-[36px]" : "h-[8px]"
          )}
        />

        <div
          className={cn(
            "relative overflow-hidden w-[48px] h-[48px] flex mx-3 rounded-[24px] group-hover:rounded-[16px] transition-all group",
            params?.serverId === id &&
              "text-primary bg-primary/10 rounded-[16px]"
          )}
        >
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-center"
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
