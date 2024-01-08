import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { DirectMessage, Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGE_BATCH = 10
export async function GET(req: NextRequest) {
    try {
        const profile = await currentProfile()
        const { searchParams } = req.nextUrl

        const cursor = searchParams.get("cursor")
        const conversationId = searchParams.get("conversationId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })

        }

        if (!conversationId) {
            return new NextResponse("ConversationId id is required", { status: 401 })
        }

        let messages: DirectMessage[] = []
        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                skip: 1, // bc we don't want to repead the certain message that the cursor is at
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH,
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }


        let nextCursor = null
        if (messages.length === MESSAGE_BATCH) {
            nextCursor = messages[MESSAGE_BATCH - 1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 501 })
    }

}