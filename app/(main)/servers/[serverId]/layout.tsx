import ServerSideBar from "@/components/server/ServerSideBar";
import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    redirect("/");
  }
  return (
    <div className="h-full min-h-screen">
      <div className="hidden md:flex flex-col fixed inset-y-0 z-20 h-full w-60">
        <ServerSideBar serverId={params.serverId} />
      </div>

      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default layout;
