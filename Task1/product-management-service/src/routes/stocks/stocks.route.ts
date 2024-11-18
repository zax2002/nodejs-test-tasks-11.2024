import { FastifyPluginAsync } from 'fastify'
import { $ref } from './stocks.schema'
import { stockChangeAmountHandler, stocksCreateHandler, stocksGetHandler } from './stocks.controller'

const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', {
    schema: {
      body: $ref('stockCreateRequestSchema')
    }
  }, stocksCreateHandler)

  fastify.get('/', {
    schema: {
      querystring: $ref('stocksGetRequestSchema')
    }
  }, stocksGetHandler)

  fastify.post('/:action/:type', {
    schema: {
      body: $ref('stockChangeAmountRequestSchema'),
      params: $ref('stockChangeAmountRequestPathSchema')
    }
  }, stockChangeAmountHandler)
}

export default route;
