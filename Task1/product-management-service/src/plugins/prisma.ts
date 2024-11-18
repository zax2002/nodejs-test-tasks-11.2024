import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'


export const prismaClient = new PrismaClient()

const prismaPlugin: FastifyPluginAsync = fp(async (server, options) => {
  await prismaClient.$connect()

  server.addHook('onClose', async (server) => {
    await prismaClient.$disconnect()
  })
})

export default prismaPlugin