## Установка

```bash
npm i
cp sample.env .env
npx prisma migrate deploy
```

## Запуск проекта

```bash
npm run start
```

## Эндпоинты

`GET /history?offset=...&limit=20` - получение истории с пагинацией
```typescript
->
{
    count: number,
    items: {
        id: number,
        timestamp: float,
        shop_id: number?,
        plu: string?,
        action_type_id: number, // добавление/изменение
        entity_type_id: number, // товар/остаток
        entity_id: number,      // id затронутой сущности в базе
        entity_column: string?, // название колонки, при изменении остатков
        value: json             // новое значение
    }[]
}
```

## Используемые технологии

- JavaScript
- Express
- Prisma+Postgresql
- Kafka

## Примечание

Данный сервис получает инфморацию об обновлениях товаров и остатков от другого сервиса через Kafka, после чего записывает её в базу