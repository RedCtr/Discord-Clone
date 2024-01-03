import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { redirect } from "next/navigation";
import React from "react";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import ToggleMode from "../ToggleMode";
import { UserButton } from "@clerk/nextjs";

const NavigationSideBar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div
      className="flex flex-col items-center text-primary h-full 
    py-4 px-2 dark:bg-[#1E1F22] w-full space-y-4"
    >
      <NavigationAction />
      <Separator className="w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full py-4">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              imageUrl={server.imageUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="flex flex-col items-center mt-auto pb-4 gap-y-4">
        <ToggleMode />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-[48px] h-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSideBar;
