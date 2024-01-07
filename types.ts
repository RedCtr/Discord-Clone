import { Member, Profile, Server } from "@prisma/client";
import { Socket, Server as NetServer } from "net";
import { Server as SocketIOServer } from "socket.io"
import { NextApiResponse } from "next";

export type ServerWithMembersAndProfiles = Server & {
    members: (Member & { profile: Profile })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer
        }
    }
}