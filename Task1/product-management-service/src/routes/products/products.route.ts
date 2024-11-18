import { FastifyPluginAsync } from "fastify"
import { $ref } from "./products.schema"
import { productCreateHandler, productsGetHandler } from "./products.controller"

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', {
    schema: {
      body: $ref("productCreateRequestSchema")
    }
  }, productCreateHandler)

  fastify.get('/', {
    schema: {
      querystring: $ref('productsGetRequestSchema')
    }
  }, productsGetHandler);
}

export default route;
