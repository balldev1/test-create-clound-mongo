import { PrismaClient } from '@prisma/client'

// {กำหนดให้ prisma global}
declare global {
    namespace globalThis {
        var prisma: PrismaClient
    }
}