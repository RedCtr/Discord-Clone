import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { Message } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const MESSAGE_BATCH = 10
export async function GET(req: NextRequest) {
    try {
        const profile = await currentProfile()
        const { searchParams } = req.nextUrl

        const cursor = searchParams.get("cursor")
        const channelId = searchParams.get("channelId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })

        }

        if (!channelId) {
            return new NextResponse("Channel id is required", { status: 401 })
        }

        let messages: Message[] = []
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                skip: 1, // bc we don't want to repead the certain message that the cursor is at
                cursor: {
                    id: cursor
                },
                where: {
                    channelId
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
            messages = await db.message.findMany({
                take: MESSAGE_BATCH,
                where: {
                    channelId
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