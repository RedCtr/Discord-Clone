import { db } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import currentPagesProfile from "@/utils/currentPagesProfile";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {


    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        const profile = await currentPagesProfile(req)
        const { messageId, serverId, channelId } = req.query
        const { content } = req.body

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (!serverId) {
            return res.status(401).json({ message: "Server Id is Required" })
        }

        if (!channelId) {
            return res.status(401).json({ message: "Channel Id is Required" })
        }

        if (!content && req.method === "PATCH") {
            return res.status(401).json({ message: "Content message is Required" })
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        })

        if (!server) {
            return res.status(405).json({ message: "Server not found " })

        }

        const member = server.members.find((member) => member.profileId === profile.id)

        if (!member) {
            return res.status(404).json({ message: "Member not found" })

        }

        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })


        if (!message || message.deleted) {
            return res.status(405).json({ message: "Message Not found" })
        }

        const isMessageOwner = message.memberId === member.id
        const isAdmin = member.role === MemberRole.ADMIN
        const isModerator = member.role === MemberRole.MODERATOR

        const canModify = isMessageOwner || isAdmin || isModerator

        if (!canModify) {
            return res.status(401).json({ message: "Unauthorized" })
        }


        if (req.method === "DELETE") {
            message = await db.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }

        if (req.method === "PATCH") {

            if (!isMessageOwner) {
                return res.status(401).json({ message: "Unauthorized" })
            }

            message = await db.message.update({
                where: {
                    id: messageId as string
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            })
        }


        const channelKey = `chat:${channelId}:messages:update`

        // emit a socket io message to all the active connections
        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)

    } catch (error) {
        console.log("error", error)
        return res.status(500).json({ error: "Internal Server Error" })

    }
}