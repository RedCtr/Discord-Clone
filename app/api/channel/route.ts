import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { channelName, type } = await req.json()
        const { searchParams } = req.nextUrl
        const profile = await currentProfile()

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }
        if (!serverId) {
            return new NextResponse("Server id is required", { status: 401 })
        }

        if (channelName === "general") {
            return new NextResponse("channel cannot be named 'general'", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create:
                    {
                        profileId: profile.id,
                        name: channelName,
                        type,
                    }

                }
            }
        })

        return NextResponse.json(server)


    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 501 })

    }
}