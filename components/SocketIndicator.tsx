"use client";
import React from "react";
import { useSocket } from "./providers/SocketProvider";
import { Badge } from "./ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge variant="outline" className="text-white bg-yellow-600 border-none">
        Fallback: Polling every 1s
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-white bg-emerald-600 border-none">
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;
