## Установка

```bash
npm i
cp sample.env .env
npx prisma migrate deploy
```

## Запуск проекта

```bash
# development
npm run dev

# test mode
npm run test

# production mode
npm run start
```

## Эндпоинты

`POST /products` - создание товара
```typescript
{
    name: string,
    plu: string,
}
->
{
    id: number // id нового товара
}
```

`GET /products?plu=...&name=...` - получение товаров по фильтрам
```typescript
->
{
    count: number,
    items: {
        id: number,
        plu: string,
        name: string
    }[]
}
```

`POST /stocks` - создание остатка
```typescript
{
    shop_id: number,
    product_id: number,
    amount_shelf: number?,
    amount_order: number?
} -> {
    id: number // id нового остатка
}
```

`GET /stocks?plu=...&shop_id=...&amount_shelf_min=...&amount_shelf_max=...&amount_order_min=...&amount_order_max=...` - получение остатков по фильтрам
```typescript
->
{
    count: number,
    items: {
        id: number,
        shop_id: number,
        product_id: number,
        amount_shelf: number,
        amount_order: number
    }[]
}
```

`POST /stocks/(increment|decrement)/(shelf|order)` - увеличение и уменьшение остатков в соответствии с ТЗ
```typescript
{
    (
        shop_id: number,  // либо комбинация магазина и товара
        product_id: number,
    ) | (
        id: number  // либо id остатка
    ),
    amount_by: number
} -> {
    amount: number // новое значение
}
```

`GET /shops` - получение магазинов (не из ТЗ)
```typescript
->
{
    count: number,
    items: {
        id: number,
        name: string
    }[]
}
```

## Используемые технологии

- TypeScript
- Fastify
- Prisma+Postgresql
- Kafka