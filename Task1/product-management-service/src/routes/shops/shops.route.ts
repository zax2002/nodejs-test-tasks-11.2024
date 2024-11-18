import { FastifyPluginAsync } from "fastify"
import { shopsGetHandler } from "./shops.controller";

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', shopsGetHandler);
}

export default route;