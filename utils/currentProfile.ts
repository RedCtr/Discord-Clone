import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs"

const currentProfile = async () => {
    const { userId } = auth()

    if (!userId) {
        return null
    }

    await db.$disconnect()
    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    })

    return profile

}

export default currentProfile