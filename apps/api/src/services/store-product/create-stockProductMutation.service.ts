import prisma from '@/prisma';
import { StoreProduct } from '@prisma/client';

interface Stock {
  productId: string;
  qty: number;
}

interface CreateStoreProductBody
  extends Omit<StoreProduct, 'id' | 'createdAt' | 'updatedAt'> {
  stocks: Stock[];
  fromStoreId: string;
}

export const createStockProductMutationService = async (
  body: CreateStoreProductBody,
) => {
  const { stocks, fromStoreId, storeId } = body;
  const toStoreId = Number(storeId);

  if (!stocks || stocks.length === 0) {
    throw new Error('stocks cannot be empty');
  }

  const checkStore = await prisma.store.findUnique({
    where: {
      id: toStoreId,
    },
  });

  if (!checkStore) {
    throw new Error("Can't find your store");
  }

  const checkFromStore = await prisma.store.findUnique({
    where: {
      id: Number(fromStoreId),
    },
  });

  if (!checkFromStore) {
    throw new Error("Can't find the source store");
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Update store products in fromStore
      for (const stock of stocks) {
        await prisma.storeProduct.update({
          where: {
            storeId_productId: {
              storeId: Number(fromStoreId),
              productId: Number(stock.productId),
            },
          },
          data: {
            qty: {
              decrement: stock.qty,
            },
          },
        });
      }

      // Update or create store products in toStore
      for (const stock of stocks) {
        await prisma.storeProduct.upsert({
          where: {
            storeId_productId: {
              storeId: toStoreId,
              productId: Number(stock.productId),
            },
          },
          update: {
            qty: {
              increment: stock.qty,
            },
          },
          create: {
            storeId: toStoreId,
            productId: Number(stock.productId),
            qty: stock.qty,
          },
        });
      }

      // Create stock journals
      const stockJournals = await prisma.stockJournal.createMany({
        data: stocks.map((stock) => ({
          quantity: stock.qty,
          type: 'MUTATION',
          status: 'SUCCESS',
          productId: Number(stock.productId),
          storeId: Number(fromStoreId),
          fromStoreId: Number(fromStoreId),
          toStoreId: toStoreId,
        })),
      });

      // Fetch created stock journals to get their IDs
      const createdStockJournals = await prisma.stockJournal.findMany({
        where: {
          storeId: Number(fromStoreId),
          type: 'MUTATION',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: stocks.length,
      });

      // Create journal details
      const journalDetails = await prisma.journalDetail.createMany({
        data: createdStockJournals.map((journal) => ({
          stockJournalId: journal.id,
          toStoreId: toStoreId,
        })),
      });

      return {
        createStoreProduct: stocks,
        stockJournals,
        journalDetails,
      };
    });

    return {
      message:
        'Store Product, Stock Journal, and Journal Detail have been created',
      data: result,
    };
  } catch (error) {
    throw error;
  }
};
