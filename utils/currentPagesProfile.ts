import { db } from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextApiRequest } from "next"

const currentPagesProfile = async (req: NextApiRequest) => {
    const { userId } = getAuth(req)

    if (!userId) {
        return null
    }

    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    })

    return profile

}

export default currentPagesProfile