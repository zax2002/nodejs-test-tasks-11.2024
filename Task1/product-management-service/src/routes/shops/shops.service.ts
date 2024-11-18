import { Shop } from "@prisma/client";
import { prismaClient } from "../../plugins/prisma";


export async function isShopExists(id: number): Promise<boolean> {
  return await prismaClient.shop.count({ where: { id } }) > 0
}

export async function getShops(): Promise<Shop[]> {
  return await prismaClient.shop.findMany()
}