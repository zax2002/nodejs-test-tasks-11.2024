import { Product } from "@prisma/client";
import { prismaClient } from "../../plugins/prisma";
import { ProductCreateRequest } from "./products.schema";


export async function createProduct(request: ProductCreateRequest) {
  const product = await prismaClient.product.create({
    data: request
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