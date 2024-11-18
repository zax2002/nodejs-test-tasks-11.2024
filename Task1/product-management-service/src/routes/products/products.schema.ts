import { z } from 'zod';
import { zodToJson } from '../../utils';


const productCreateRequestSchema = z.object({
  plu: z.string(),
  name: z.string(),
})
export type ProductCreateRequest = z.infer<typeof productCreateRequestSchema>;

export type ProductCreateResponse = {
  id: number
}

const productsGetRequestSchema = z.object({
  plu: z.string().optional(),
  name: z.string().optional(),
})
export type ProductsGetRequest = z.infer<typeof productsGetRequestSchema>;

export type ProductsGetResponse = {
  count: number,
  items: {
    id: number,
    plu: string,
    name: string
  }[]
}


export const { schemas: productsSchemas, $ref } = zodToJson({
  productCreateRequestSchema,
  productsGetRequestSchema,
})