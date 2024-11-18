import { FastifyReply, FastifyRequest } from "fastify";
import { StockChangeAmountRequest, StockChangeAmountRequestPath, StockChangeAmountResponse, StockCreateRequest, StockCreateResponse, StocksGetRequest, StocksGetResponse } from "./stocks.schema";
import { httpErrors } from "@fastify/sensible";
import { changeStockAmount, createStock, getStocks, isStockExists } from "./stocks.service";
import { isShopExists } from "../shops/shops.service";
import { isProductExists } from "../products/products.service";

export async function stocksCreateHandler(
  request: FastifyRequest<{Body: StockCreateRequest}>,
  reply: FastifyReply,
): Promise<StockCreateResponse> {
  if (await isStockExists(request.body.shop_id, request.body.product_id))
    throw httpErrors.conflict('сannot create. Stock already exists for the requested pair of Shop and Product');

  if (!(await isShopExists(request.body.shop_id)))
    throw httpErrors.notFound('Shop not found')

  if (!(await isProductExists(request.body.product_id)))
    throw httpErrors.notFound('Product not found')

  const stock = await createStock(request.body);

  return reply.code(201), {
    id: stock.id
  }
}

export async function stocksGetHandler(
  request: FastifyRequest<{Querystring: StocksGetRequest}>,
  reply: FastifyReply,
): Promise<StocksGetResponse> {
  const stocks = await getStocks(
    request.query.shop_id,
    request.query.plu,
    request.query.amount_shelf_min,
    request.query.amount_shelf_max,
    request.query.amount_order_min,
    request.query.amount_order_max,
  )

  return {
    count: stocks.length,
    items: stocks
  }
}

export async function stockChangeAmountHandler(
  request: FastifyRequest<{Body: StockChangeAmountRequest, Params: StockChangeAmountRequestPath}>,
  reply: FastifyReply,
): Promise<StockChangeAmountResponse> {
  const isIdPassed = request.body.id !== undefined;
  const isShopProductPassed = request.body.shop_id !== undefined && request.body.product_id !== undefined;

  if(isIdPassed === isShopProductPassed) {
    reply.code(400);
    throw new Error("body must have either 'id' or both 'shop_id' and 'product_id', but not a mix of these");
  }

  const amount = await changeStockAmount(
    request.body.id,
    request.body.shop_id,
    request.body.product_id,
    request.params.action,
    request.params.type,
    request.body.amount_by
  );

  return { amount }  
}