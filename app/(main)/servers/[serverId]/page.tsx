import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type ServerType = {
  params: {
    serverId: string;
  };
};
const ServerPage = async ({ params }: ServerType) => {
  const profile = await currentProfile();
  if (!profile) {
    redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return redirect(
    `/servers/${params.serverId}/channels/${server?.channels[0]?.id}`
  );
};

export default ServerPage;
