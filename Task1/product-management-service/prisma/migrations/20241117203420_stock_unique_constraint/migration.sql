/*
  Warnings:

  - A unique constraint covering the columns `[shop_id,product_id]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stock_shop_id_product_id_key" ON "Stock"("shop_id", "product_id");
