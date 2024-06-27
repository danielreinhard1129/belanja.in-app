import prisma from '@/prisma';
import { StoreProduct } from '@prisma/client';

interface Stock {
  productId: string;
  qty: number;
}

interface CreateRequestStoreProductBody
  extends Omit<StoreProduct, 'id' | 'createdAt' | 'updatedAt'> {
  stocks: Stock[];
  fromStoreId: string;
  type: string;
}

export const createRequestStockProductMutationService = async (
  body: CreateRequestStoreProductBody,
) => {
  try {
    const { stocks, fromStoreId, storeId, type } = body;
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
      throw new Error("Can't find the store");
    }

    const checkFromStore = await prisma.store.findUnique({
      where: {
        id: Number(fromStoreId),
      },
    });

    if (!checkFromStore) {
      throw new Error("Can't find the source store");
    }

    const createRequestStockJournalsMutation = [];

    if (type === 'export') {
      // Fetch the current quantities of the products in the source store
      const productQuantities = await prisma.storeProduct.findMany({
        where: {
          storeId: Number(fromStoreId),
          productId: {
            in: stocks.map((stock) => Number(stock.productId)),
          },
        },
        select: {
          productId: true,
          qty: true,
        },
      });

      // Create a map of product quantities for quick lookup
      const productQtyMap = new Map(
        productQuantities.map((p) => [p.productId, p.qty]),
      );

      // Check if any product's quantity will be zero after the export
      for (const stock of stocks) {
        const currentQty = productQtyMap.get(Number(stock.productId));
        if (currentQty === undefined) {
          throw new Error(
            `Product with ID ${stock.productId} not found in the store`,
          );
        }
        if (currentQty - stock.qty <= 0) {
          throw new Error(
            `Insufficient quantity for product ID ${stock.productId}`,
          );
        }
      }

      // Create stock journals
      const stockJournals = await prisma.stockJournal.createMany({
        data: stocks.map((stock) => ({
          quantity: stock.qty,
          type: 'MUTATION_EXPORT',
          status: 'WAITING_ADMIN_CONFIRMATION',
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
          type: 'MUTATION_EXPORT',
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

      createRequestStockJournalsMutation.push(...createdStockJournals);
    }

    if (type === 'import') {
      // Fetch the current quantities of the products in the destination store
      const productQuantities = await prisma.storeProduct.findMany({
        where: {
          storeId: Number(toStoreId),
          productId: {
            in: stocks.map((stock) => Number(stock.productId)),
          },
        },
        select: {
          productId: true,
          qty: true,
        },
      });

      // Create a map of product quantities for quick lookup
      const productQtyMap = new Map(
        productQuantities.map((p) => [p.productId, p.qty]),
      );

      // Check if any product's quantity will be zero after the import
      for (const stock of stocks) {
        const currentQty = productQtyMap.get(Number(stock.productId));
        if (currentQty === undefined) {
          throw new Error(
            `Product with ID ${stock.productId} not found in the store`,
          );
        }
        if (currentQty - stock.qty <= 0) {
          throw new Error(
            `Insufficient quantity for product ID ${stock.productId}`,
          );
        }
      }

      // Create stock journals
      const stockJournals = await prisma.stockJournal.createMany({
        data: stocks.map((stock) => ({
          quantity: stock.qty,
          type: 'MUTATION_IMPORT',
          status: 'WAITING_ADMIN_CONFIRMATION',
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
          type: 'MUTATION_IMPORT',
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

      createRequestStockJournalsMutation.push(...createdStockJournals);
    }

    if (type === 'increase') {
      // Check if the product exists in the fromStore
      // for (const stock of stocks) {
      //   const product = await prisma.storeProduct.findUnique({
      //     where: {
      //       storeId_productId: {
      //         storeId: Number(fromStoreId),
      //         productId: Number(stock.productId),
      //       },
      //     },
      //   });

      //   if (!product) {
      //     throw new Error(
      //       `Product with ID ${stock.productId} not found in the source store`,
      //     );
      //   }
      // }

      // Create stock journals
      const stockJournals = await prisma.stockJournal.createMany({
        data: stocks.map((stock) => ({
          quantity: stock.qty,
          type: 'INCREASE',
          status: 'WAITING_ADMIN_CONFIRMATION',
          productId: Number(stock.productId),
          storeId: Number(fromStoreId),
          fromStoreId: Number(fromStoreId),
          toStoreId: null,
        })),
      });

      // Fetch created stock journals to get their IDs
      const createdStockJournals = await prisma.stockJournal.findMany({
        where: {
          storeId: Number(fromStoreId),
          type: 'INCREASE',
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
          toStoreId: null,
        })),
      });

      createRequestStockJournalsMutation.push(...createdStockJournals);
    }

    if (type === 'decrease') {
      // Check if the product exists and quantity is sufficient in the fromStore
      for (const stock of stocks) {
        const product = await prisma.storeProduct.findUnique({
          where: {
            storeId_productId: {
              storeId: Number(fromStoreId),
              productId: Number(stock.productId),
            },
          },
        });

        if (!product) {
          throw new Error(
            `Product with ID ${stock.productId} not found in the source store`,
          );
        }

        if (product.qty - stock.qty < 0) {
          throw new Error(
            `Insufficient quantity for product ID ${stock.productId}`,
          );
        }
      }

      // Create stock journals
      const stockJournals = await prisma.stockJournal.createMany({
        data: stocks.map((stock) => ({
          quantity: stock.qty,
          type: 'DECREASE',
          status: 'WAITING_ADMIN_CONFIRMATION',
          productId: Number(stock.productId),
          storeId: Number(fromStoreId),
          fromStoreId: Number(fromStoreId),
          toStoreId: null,
        })),
      });

      // Fetch created stock journals to get their IDs
      const createdStockJournals = await prisma.stockJournal.findMany({
        where: {
          storeId: Number(fromStoreId),
          type: 'DECREASE',
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
          toStoreId: null,
        })),
      });

      createRequestStockJournalsMutation.push(...createdStockJournals);
    }

    return {
      message:
        'Store Product, Stock Journal, and Journal Detail have been created',
      data: createRequestStockJournalsMutation,
    };
  } catch (error) {
    throw error;
  }
};
