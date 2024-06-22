import prisma from '@/prisma';

export const getStocksByStoreAdminService = async (storeAdminId: number) => {
  try {
    const storeProducts = await prisma.storeProduct.findMany({
      where: {
        store: {
          storeAdminId,
        },
      },
      include: {
        store: {
          include: {
            stockJournals: {
              include: {
                JournalDetail: true,
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

    // const JournalDetails = await prisma.stockJournal.findMany({});

    if (!storeProducts.length) {
      throw new Error('No storeProducts found for this storeAdmin');
    }

    return storeProducts;
  } catch (error) {
    throw error;
  }
};
