import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

interface QueryGetStocksService {
  take: number;
  page: number;
  stockJournalsTake: number;
  stockJournalsPage: number;
  search: string;
  storeId: string | undefined;
}

interface UserToken {
  id: number;
}

export const getStocksService = async (
  userToken: UserToken,
  query: QueryGetStocksService,
) => {
  try {
    const { search, take, page, stockJournalsTake, stockJournalsPage } = query;
    const storeId = query.storeId ? Number(query.storeId) : undefined;

    const user = await prisma.user.findFirst({
      where: {
        id: Number(userToken.id),
      },
      include: {
        storeAdmin: {
          include: {
            stores: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Can't find your account");
    }

    if (user.role === 'USER') {
      throw new Error(`You are not an Admin!!! ${userToken.id}`);
    }

    const isSuperAdmin = user.role === 'SUPERADMIN';

    let userStoreIds: number[] | undefined;
    const findFirstStoreAdmin = await prisma.storeAdmin.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        stores: true,
      },
    });

    const findFirstStore = findFirstStoreAdmin?.stores ?? null;
    if (!findFirstStore) {
      throw new Error('You do not have any store');
    }
    if (!isSuperAdmin) {
      // Mengecek apakah user.storeAdmin dan user.storeAdmin.stores ada
      if (user.storeAdmin && user.storeAdmin.stores) {
        userStoreIds = [user.storeAdmin.stores.id];
      }
    }

    // Query for storeProduct
    const storeProductQuery: Prisma.StoreProductFindManyArgs = {
      where: {
        storeId: storeId,
      },
      include: {
        store: true,
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
      skip: (page - 1) * take,
      take: take,
    };

    if (!isSuperAdmin) {
      storeProductQuery.where = {
        ...storeProductQuery.where,
        storeId: {
          in: userStoreIds,
        },
      };
    }

    if (search) {
      storeProductQuery.where = {
        ...storeProductQuery.where,
        product: {
          name: {
            contains: search,
          },
        },
      };
    }

    const storeProducts = await prisma.storeProduct.findMany(storeProductQuery);
    const storeProductCount = await prisma.storeProduct.count({
      where: storeProductQuery.where,
    });

    // Aggregate sum of stock for storeProduct based on role
    const stockSum = await prisma.storeProduct.groupBy({
      by: ['storeId'],
      _sum: {
        qty: true,
      },
      where: storeProductQuery.where,
    });

    // Query for stockJournals
    const stockJournalQuery: Prisma.StockJournalFindManyArgs = {
      where: {
        storeId: storeId,
      },
      include: {
        JournalDetail: {
          include: {
            toStore: true,
          },
        },
      },
      skip: (stockJournalsPage - 1) * stockJournalsTake,
      take: stockJournalsTake,
    };

    if (!isSuperAdmin) {
      stockJournalQuery.where = {
        ...stockJournalQuery.where,
        storeId: {
          in: userStoreIds,
        },
      };
    }

    if (search) {
      stockJournalQuery.where = {
        ...stockJournalQuery.where,
        JournalDetail: {
          some: {
            toStore: {
              name: {
                contains: search,
              },
            },
          },
        },
      };
    }

    const stockJournals = await prisma.stockJournal.findMany(stockJournalQuery);
    const stockJournalCount = await prisma.stockJournal.count({
      where: stockJournalQuery.where,
    });

    return {
      storeProducts: {
        data: storeProducts,
        meta: {
          page,
          take,
          total: storeProductCount,
        },
      },
      stockJournals: {
        data: stockJournals,
        meta: {
          page: stockJournalsPage,
          take: stockJournalsTake,
          total: stockJournalCount,
        },
      },
      stockSum: stockSum.map((sum) => ({
        storeId: sum.storeId,
        totalStock: sum._sum.qty || 0,
      })),
    };
  } catch (error) {
    throw error;
  }
};
