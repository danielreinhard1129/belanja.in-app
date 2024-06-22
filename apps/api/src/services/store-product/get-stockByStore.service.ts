import prisma from '@/prisma';

export const getStocksByStoreService = async (storeId: number) => {
  try {
    // Fetch all stocks for the given store
    const stocks = await prisma.storeProduct.findMany({
      where: {
        storeId,
      },
      include: {
        store: {
          include: {
            stockJournals: {
              include: {
                JournalDetail: {
                  include: {
                    toStore: true,
                  },
                },
              },
            },
          },
        },
        product: {
          include: {
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!stocks.length) {
      throw new Error('No stocks found for this store');
    }

    // Calculate total quantity of stock for the given store
    const totalQuantityStore = await prisma.storeProduct.aggregate({
      _sum: {
        qty: true,
      },
      where: {
        storeId,
      },
    });

    const totalQty = totalQuantityStore._sum.qty || 0;

    // Update the qty field in the Store model
    await prisma.store.update({
      where: { id: storeId },
      data: { qty: totalQty },
    });

    // Add total field to each stock object
    const stocksWithTotal = stocks.map((stock) => ({
      ...stock,
      total: totalQty, // Assigning totalQty to each stock
    }));

    // Return the stocks
    return stocksWithTotal;
  } catch (error) {
    throw error;
  }
};
