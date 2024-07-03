import prisma from '@/prisma';
import { StoreProduct, StockJournal } from '@prisma/client';

interface Stock {
  productId: string;
  qty: number;
}

interface userToken {
  id: number;
}

interface CreateStockSuperAdmin
  extends Omit<StoreProduct, 'id' | 'createdAt' | 'updatedAt'> {
  stocks: Stock[];
  fromStoreId: string;
  type: string;
}

export const createStockSuperAdminService = async (
  body: CreateStockSuperAdmin,
  user: userToken,
) => {
  try {
    const { stocks, fromStoreId, storeId, type } = body;
    const toStoreId = Number(storeId);

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

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

    // Mengubah tipe array menjadi StockJournal[]
    const createRequestStockJournalsMutation: StockJournal[] = [];

    if (type === 'export') {
      const result = await prisma.$transaction(async (prisma) => {
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
            status: 'ON_PROGRESS',
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

        createRequestStockJournalsMutation.push(...createdStockJournals);
      });
    }

    if (type === 'import') {
      const result = await prisma.$transaction(async (prisma) => {
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
              `Product with ID ${stock.productId} not found in the destination store`,
            );
          }
          if (currentQty - stock.qty <= 0) {
            throw new Error(
              `Insufficient quantity for product ID ${stock.productId} in the destination store`,
            );
          }
        }

        // Update store products in toStore
        for (const stock of stocks) {
          await prisma.storeProduct.update({
            where: {
              storeId_productId: {
                storeId: Number(toStoreId),
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

        // Update or create store products in fromStore
        for (const stock of stocks) {
          await prisma.storeProduct.upsert({
            where: {
              storeId_productId: {
                storeId: Number(fromStoreId),
                productId: Number(stock.productId),
              },
            },
            update: {
              qty: {
                increment: stock.qty,
              },
            },
            create: {
              storeId: Number(fromStoreId),
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
            status: 'ON_PROGRESS',
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

        createRequestStockJournalsMutation.push(...createdStockJournals);
      });
    }

    // FIX
    if (type === 'increase') {
      const result = await prisma.$transaction(async (prisma) => {
        // Update store products in fromStore
        for (const stock of stocks) {
          const existingProduct = await prisma.storeProduct.findUnique({
            where: {
              storeId_productId: {
                storeId: Number(fromStoreId),
                productId: Number(stock.productId),
              },
            },
          });

          if (!existingProduct) {
            await prisma.storeProduct.create({
              data: {
                storeId: Number(fromStoreId),
                productId: Number(stock.productId),
                qty: stock.qty,
              },
            });
          } else {
            await prisma.storeProduct.update({
              where: {
                storeId_productId: {
                  storeId: Number(fromStoreId),
                  productId: Number(stock.productId),
                },
              },
              data: {
                qty: {
                  increment: stock.qty,
                },
              },
            });
          }
        }
        // Create stock journals
        const stockJournals = await prisma.stockJournal.createMany({
          data: stocks.map((stock) => ({
            quantity: stock.qty,
            type: 'MUTATION',
            status: 'ON_PROGRESS',
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

        createRequestStockJournalsMutation.push(...createdStockJournals);
      });
    }

    if (type === 'decrease') {
      const result = await prisma.$transaction(async (prisma) => {
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

        // Check if any product's quantity will be zero after the decrease
        for (const stock of stocks) {
          const currentQty = productQtyMap.get(Number(stock.productId));
          if (currentQty === undefined) {
            throw new Error(
              `Product with ID ${stock.productId} not found in the destination store`,
            );
          }
          if (currentQty - stock.qty <= 0) {
            throw new Error(
              `Insufficient quantity for product ID ${stock.productId} in the destination store`,
            );
          }
        }

        // Update store products in toStore
        for (const stock of stocks) {
          await prisma.storeProduct.update({
            where: {
              storeId_productId: {
                storeId: Number(toStoreId),
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

        // Update or create store products in fromStore
        for (const stock of stocks) {
          await prisma.storeProduct.upsert({
            where: {
              storeId_productId: {
                storeId: Number(fromStoreId),
                productId: Number(stock.productId),
              },
            },
            update: {
              qty: {
                increment: stock.qty,
              },
            },
            create: {
              storeId: Number(fromStoreId),
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
            status: 'ON_PROGRESS',
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

        createRequestStockJournalsMutation.push(...createdStockJournals);
      });
    }

    return {
      message: 'Stock Successful with ON_PROGRESS status',
      data: createRequestStockJournalsMutation,
    };
  } catch (error) {
    throw error;
  }
};
