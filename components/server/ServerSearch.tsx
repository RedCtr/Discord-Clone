"use client";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useParams, useRouter } from "next/navigation";

type ServerSearchType = {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};
const ServerSearch = ({ data }: ServerSearchType) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "K" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "member") {
      router.push(`/servers/${params.serverId}/conversations/${id}`);
    }

    if (type === "channel") {
      router.push(`/servers/${params.serverId}/channels/${id}`);
    }
  };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-x-2 w-full px-2 py-2 group rounded-md 
    hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-colors text-zinc-500 dark:text-zinc-400"
      >
        <Search className="w-4 h-4" />
        <p className="text-sm font-medium group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
          Search
        </p>

        <kbd
          className="ml-auto inline-flex items-center gap-1 rounded h-5 font-mono
      pointer-events-none select-none text-muted-foreground bg-muted px-2 text-[10px]"
        >
          <span className="text-xs">CMD</span> k
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No Results found</CommandEmpty>

          {data.map(({ label, data, type }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ icon, id, name }) => (
                  <CommandItem onSelect={() => onClick({ id, type })} key={id}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
