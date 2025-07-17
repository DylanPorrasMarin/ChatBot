// lib/prisma.ts

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Evita crear múltiples instancias de Prisma en desarrollo (Next.js reinicia el server a menudo)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
