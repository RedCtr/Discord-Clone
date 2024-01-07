import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile()
        const { searchParams } = req.nextUrl

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 400 })
        }

        if (!serverId) {
            return new NextResponse("Server Id is required", { status: 400 })
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
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)


    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}

export async function PATCH(req: NextRequest, { params }: { params: { channelId: string } }) {
    try {
        const profile = await currentProfile()
        const { searchParams } = req.nextUrl
        const { channelName, type } = await req.json()

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 400 })
        }

        if (!serverId) {
            return new NextResponse("Server Id is required", { status: 400 })
        }

        if (channelName === "general") {
            return new NextResponse("ChannelName cannet be 'general'", { status: 400 })
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
                    update: {
                        where: {
                            id: params.channelId,

                        },
                        data: {
                            name: channelName,
                            type,
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)


    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}