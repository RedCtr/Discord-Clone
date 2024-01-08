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
        const { conversationId } = req.query

        if (!profile) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        if (!conversationId) {
            return res.status(401).json({ message: "Conversation Id is Required" })
        }

        if (!content) {
            return res.status(401).json({ message: "Content message is Required" })
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    },
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                },
            }
        })

        if (!conversation) {
            return res.status(405).json({ message: "we are not able to find the conversation" })

        }

        const { memberOne, memberTwo } = conversation

        const member = memberOne.profileId === profile.id ? memberOne : memberTwo

        if (!member) {
            return res.status(404).json({ message: "Member not found" })

        }

        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
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


        const channelKey = `chat:${conversationId}:messages`

        // emit a socket io message to all the active connections
        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" })

    }
}