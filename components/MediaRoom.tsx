"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

type MediaRoomType = {
  chatId: string;
  video: boolean;
  audio: boolean;
};

const MediaRoom = ({ chatId, video, audio }: MediaRoomType) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!user?.firstName || !user.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const res = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.log("error", error);
      }
    })();
  }, [user, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-col items-center justify-center flex-1">
        <Loader2 className="w-7 h-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading ...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      data-lk-theme="default"
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect
      audio={audio}
      video={video}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;
