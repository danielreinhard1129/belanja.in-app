import prisma from '@/prisma';

export const getStocksByStoreService = async (storeId: number) => {
  try {
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
    const totalQuantityStore = await prisma.storeProduct.aggregate({
      _sum: {
        qty: true,
      },
      where: {
        storeId,
      },
    });
    const totalQty = totalQuantityStore._sum.qty || 0;
    await prisma.store.update({
      where: { id: storeId },
      data: { qty: totalQty },
    });
    const stocksWithTotal = stocks.map((stock) => ({
      ...stock,
      total: totalQty,
    }));
    return stocksWithTotal;
  } catch (error) {
    throw error;
  }
};
