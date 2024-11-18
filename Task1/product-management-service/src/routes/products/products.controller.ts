import { FastifyReply, FastifyRequest } from "fastify";
import { ProductCreateRequest, ProductCreateResponse, ProductsGetRequest, ProductsGetResponse } from "./products.schema";
import { createProduct, getProducts } from "./products.service";

export async function productCreateHandler(
  request: FastifyRequest<{Body: ProductCreateRequest}>,
  reply: FastifyReply,
): Promise<ProductCreateResponse> {
  const product = await createProduct(request.body, request.server.kafka.producer);
  
  return reply.code(201), product;
}

export async function productsGetHandler(
  request: FastifyRequest<{Querystring: ProductsGetRequest}>,
  reply: FastifyReply,
): Promise<ProductsGetResponse> {
  const products = await getProducts(request.query.plu, request.query.name);

  return reply.code(200), {
    count: products.length,
    items: products
  };
}