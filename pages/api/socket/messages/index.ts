import { db } from "@/lib/prisma";
import { NextApiResponseServerIo } from "@/types";
import currentPagesProfile from "@/utils/currentPagesProfile";
import currentProfile from "@/utils/currentProfile";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Unsupported http method" })
    }

    try {
        const profile = await currentPagesProfile(req)
        const { content, fileUrl } = req.body
        const { serverId, channelId } = req.query

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (!serverId) {
            return res.status(401).json({ message: "Server Id is Required" })
        }

        if (!channelId) {
            return res.status(401).json({ message: "Channel Id is Required" })
        }

        if (!content) {
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
            return res.status(405).json({ message: "we are not able to find the server " })

        }

        const member = server.members.find((member) => member.profileId === profile.id)

        if (!member) {
            return res.status(404).json({ message: "Member not found" })

        }

        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })


        const channelKey = `chat:${channelId}:messages`

        // emit a socket io message to all the active connections
        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })

    }
}