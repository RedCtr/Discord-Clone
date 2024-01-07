import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarType = {
  src: string;
  className?: string;
};

const UserAvatar = ({ src, className }: UserAvatarType) => {
  return (
    <Avatar className={cn("w-7 h-7 md:w-10 md:h-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
