import { Stock } from "@prisma/client";
import { prismaClient } from "../../plugins/prisma";
import { StockCreateRequest } from "./stocks.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { httpErrors } from "@fastify/sensible";


export async function createStock(request: StockCreateRequest): Promise<Stock> {
  return await prismaClient.stock.create({
    data: request
  })
}

export async function isStockExists(shopId: number, productId: number): Promise<boolean> {
  return await prismaClient.stock.count({
    where: {
      shop_id: shopId,
      product_id: productId
    }
  }) > 0;
}

export async function getStocks(
  shopId?: number,
  plu?: string,
  amountShelfMin?: number,
  amountShelfMax?: number,
  amountOrderMin?: number,
  amountOrderMax?: number,
): Promise<Stock[]> {
  return await prismaClient.stock.findMany({
    where: {
      shop_id: shopId,
      product: {
        plu: {
          equals: plu,
          mode: 'insensitive'
        }
      },
      amount_shelf: {
        gte: amountShelfMin,
        lte: amountShelfMax,
      },
      amount_order: {
        gte: amountOrderMin,
        lte: amountOrderMax,
      },
    }
  })
}

export async function changeStockAmount(
  stockId: number | undefined,
  shopId: number | undefined,
  productId: number | undefined,
  action: 'increment' | 'decrement',
  type: 'shelf' | 'order',
  amount: number
): Promise<number> {
  const column = type === "shelf" ? "amount_shelf" : "amount_order";
  const operation = action;

  const where = (shopId !== undefined && productId !== undefined) ? {
    shop_id_product_id: {
      shop_id: shopId,
      product_id: productId,
    }
  } : {
    id: stockId
  }

  const stock = await prismaClient.stock.update({
    where,
    data: {
      [column]: {
        [operation]: amount
      }
    }
  }).catch((e) => {
    if (
      e instanceof PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      throw httpErrors.notFound("no such Stock")
    }
  
    throw e
  });

  return stock[column];
}