import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

type InviteType = {
  params: {
    inviteCode: string;
  };
};
const Invite = async ({ params }: InviteType) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }

  // check if the user is already in existing server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer}`);
  }

  const addUserToServer = await db.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  return redirect(`/servers/${addUserToServer.id}`);
};

export default Invite;
