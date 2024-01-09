import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient({ log: ["error", "info", "query", "warn"] })

if (process.env.NODE_ENV === "development") globalThis.prisma = db