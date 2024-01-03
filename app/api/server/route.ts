import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { ChannelType, MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
    try {
        const { serverName, imageUrl } = await req.json()

        const profile = await currentProfile()
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: serverName,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { profileId: profile.id, name: "general" }
                    ]
                },
                members: {
                    create: [
                        {
                            profileId: profile.id,
                            role: MemberRole.ADMIN
                        }
                    ]
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        return new NextResponse("Inter Error", { status: 500 })

    }
}