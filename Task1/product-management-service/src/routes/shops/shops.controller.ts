import { ShopsGetResponse } from "./shops.schema";
import { getShops } from "./shops.service";

export async function shopsGetHandler(): Promise<ShopsGetResponse> {
  const shops = await getShops();

  return {
    count: shops.length,
    items: shops
  };
}