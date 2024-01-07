import { db } from "@/lib/prisma";
import currentProfile from "@/utils/currentProfile";
import { NextRequest, NextResponse } from "next/server";

type Props = {
    params: {
        memberId: string
    },
}
export async function PATCH(req: NextRequest, { params }: Props) {

    try {
        const { searchParams } = req.nextUrl
        const { role } = await req.json()
        const profile = await currentProfile()

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.memberId) {
            return new NextResponse("Member Id is Missing", { status: 400 })
        }

        if (!serverId) {
            return new NextResponse("Server Id is Required", { status: 400 })


        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    },
                }

            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}

export async function DELETE(req: NextRequest, { params }: Props) {
    try {
        const { searchParams } = req.nextUrl
        const profile = await currentProfile()

        const serverId = searchParams.get("serverId")

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!params.memberId) {
            return new NextResponse("Member Id is Missing", { status: 400 })
        }

        if (!serverId) {
            return new NextResponse("Server Id is Required", { status: 400 })
        }



        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 })

    }
}