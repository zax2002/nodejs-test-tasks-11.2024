import { Product } from "@prisma/client";
import { prismaClient } from "../../plugins/prisma";
import { ProductCreateRequest } from "./products.schema";
import { FastifyInstance } from "fastify";


export async function createProduct(
  request: ProductCreateRequest,
  kafkaProducer: FastifyInstance["kafka"]["producer"]
) {
  const product = await prismaClient.product.create({
    data: request
  })

  kafkaProducer.send({
    topic: 'history-updates',
    messages: [{
      key: 'datakey',
      value: JSON.stringify({
        timestamp: Date.now(),
        entity: 'product',
        action: 'created',
        id: product.id,
        column: null,
        value: product,
      })
    }],
  })

  return { id: product.id };
}

export async function isProductExists(id: number): Promise<boolean> {
  return await prismaClient.product.count({ where: { id } }) > 0
}

export async function getProducts(
  plu: string|undefined,
  nameQuery: string|undefined
): Promise<Product[]> {
  return await prismaClient.product.findMany({
    where: {
      plu: {
        equals: plu,
        mode: 'insensitive'
      },
      name: {
        contains: nameQuery,
        mode: 'insensitive'
      }
    }
  });
}