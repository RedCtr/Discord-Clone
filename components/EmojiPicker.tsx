"use client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { useTheme } from "next-themes";

type EmojiPickerType = {
  onChange: (value: string) => void;
};

const EmojiPicker = ({ onChange }: EmojiPickerType) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile
          className="text-zinc-500 hover:text-zinc-600 
        dark:text-zinc-400 dark:hover:text-zinc-300 transition-colors"
        />
      </PopoverTrigger>

      <PopoverContent
        side="right"
        sideOffset={40}
        className="shadow-none drop-shadow-none bg-transparent border-none mb-16"
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji?.native)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
