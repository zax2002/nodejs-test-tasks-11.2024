import { z } from 'zod';
import { zodToJson } from '../../utils';


const stockCreateRequestSchema = z.object({
  shop_id: z.number(),
  product_id: z.number(),
  amount_shelf: z.number().optional(),
  amount_order: z.number().optional(),
})
export type StockCreateRequest = z.infer<typeof stockCreateRequestSchema>

export type StockCreateResponse = {
  id: number,
}

const stockChangeAmountRequestSchema = z.object({
  id: z.number().optional(),

  shop_id: z.number().optional(),
  product_id: z.number().optional(),

  amount_by: z.number().positive(),
})
export type StockChangeAmountRequest = z.infer<typeof stockChangeAmountRequestSchema>

const stockChangeAmountRequestPathSchema = z.object({
  action: z.enum(['increment', 'decrement']),
  type: z.enum(['shelf', 'order'])
})
export type StockChangeAmountRequestPath = z.infer<typeof stockChangeAmountRequestPathSchema>

export type StockChangeAmountResponse = {
  amount: number
}

const stocksGetRequestSchema = z.object({
  plu: z.string().optional(),
  shop_id: z.number().optional(),

  amount_shelf_min: z.number().optional(),
  amount_shelf_max: z.number().optional(),

  amount_order_min: z.number().optional(),
  amount_order_max: z.number().optional(),
})
export type StocksGetRequest = z.infer<typeof stocksGetRequestSchema>


export type StocksGetResponse = {
  count: number,
  items: {
    id: number,
    shop_id: number,
    product_id: number,
    amount_shelf: number,
    amount_order: number
  }[]
}

export const { schemas: stockSchemas, $ref } = zodToJson({
  stockCreateRequestSchema,
  stockChangeAmountRequestSchema,
  stockChangeAmountRequestPathSchema,
  stocksGetRequestSchema,
})