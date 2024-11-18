import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database..');

  const shopsCreated = await prisma.shop.createManyAndReturn({
    data: [
      {
        name: 'Всё для дома'
      },
      {
        name: 'Сантехника от Михалыча'
      }
    ]
  });

  const productsCreated = await prisma.product.createManyAndReturn({
    data: [
      {
        name: 'Опора ЛЭП У35-2 башенного типа',
        plu: 'ЛЭП-У35-2'
      },
      {
        name: 'Премиум Душевая кабина Orans SR-89105RS белая, с баней',
        plu: 'SR-89105RS'
      }
    ]
  })

  await prisma.stock.createMany({
    data: [
      {
        shop_id: shopsCreated[0].id,
        product_id: productsCreated[0].id,
        amount_shelf: 18,
        amount_order: 0
      },
      {
        shop_id: shopsCreated[1].id,
        product_id: productsCreated[1].id,
        amount_shelf: 4,
        amount_order: 2
      }
    ]
  })

  console.log('Done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });