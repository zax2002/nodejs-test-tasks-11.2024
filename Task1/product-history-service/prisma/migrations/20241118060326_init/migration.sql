-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "timestamp" DOUBLE PRECISION NOT NULL,
    "shop_id" INTEGER,
    "plu" TEXT,
    "action_type_id" INTEGER NOT NULL,
    "entity_type_id" INTEGER NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "entity_column" TEXT,
    "value" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
