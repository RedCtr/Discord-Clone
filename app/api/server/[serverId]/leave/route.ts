import { db } from "@/lib/prisma"
import currentProfile from "@/utils/currentProfile"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, { params }: { params: { serverId: string } }) {
    try {
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.serverId) {
            return new NextResponse("Server Id is Missing", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}