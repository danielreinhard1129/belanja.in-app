import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetStockJournalByParams extends PaginationQueryParams {
  search?: string;
}

interface UserToken {
  id: number;
}

export const getStockJournalByStoreService = async (
  userToken: UserToken,
  query: GetStockJournalByParams,
) => {
  const { search, take, page } = query;
  const userId = Number(userToken.id);

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
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
    throw new Error(`You do not have access`);
  }

  const storeId = user.storeAdmin?.stores?.id;

  if (!storeId) {
    throw new Error('No store found for this user');
  }

  try {
    const stockJournal = await prisma.stockJournal.findMany({
      where: {
        OR: [
          { storeId },
          { toStoreId: storeId },
          { fromStoreId: storeId },
          {
            JournalDetail: {
              some: {
                toStoreId: storeId,
              },
            },
          },
          {
            JournalDetail: {
              some: {
                stockJournal: {
                  fromStoreId: storeId,
                },
              },
            },
          },
        ],
      },
      include: {
        product: true,
        store: true,
        JournalDetail: {
          include: {
            toStore: true,
          },
        },
      },
      skip: (page - 1) * take,
      take,
    });

    if (!stockJournal.length) {
      throw new Error('No stockJournal found');
    }

    const count = await prisma.stockJournal.count({
      where: {
        OR: [
          { storeId },
          { toStoreId: storeId },
          { fromStoreId: storeId },
          {
            JournalDetail: {
              some: {
                toStoreId: storeId,
              },
            },
          },
          {
            JournalDetail: {
              some: {
                stockJournal: {
                  fromStoreId: storeId,
                },
              },
            },
          },
        ],
      },
    });

    return {
      data: stockJournal,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
