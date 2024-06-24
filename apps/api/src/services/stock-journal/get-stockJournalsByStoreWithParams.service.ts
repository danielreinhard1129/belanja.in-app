import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetStockJournalByParams extends PaginationQueryParams {
  search?: string;
  storeId?: string;
}

interface UserToken {
  id: number;
}

export const getStockJournalsByStoreWithParamsService = async (
  userToken: UserToken,
  query: GetStockJournalByParams,
) => {
  const { take, page, storeId } = query;
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

  if (user.role === 'USER' || user.role === 'STOREADMIN') {
    throw new Error(`You do not have access`);
  }

  let where = {}; // Deklarasikan where sebagai objek kosong

  // Jika storeId tidak didefinisikan, tampilkan semua data
  if (storeId) {
    where = {
      OR: [
        {
          storeId: Number(storeId),
        },
        {
          toStoreId: Number(storeId),
        },
        {
          fromStoreId: Number(storeId),
        },
        {
          JournalDetail: {
            some: {
              toStoreId: Number(storeId),
            },
          },
        },
        {
          JournalDetail: {
            some: {
              stockJournal: {
                fromStoreId: Number(storeId),
              },
            },
          },
        },
      ],
    };
  }

  try {
    const stockJournal = await prisma.stockJournal.findMany({
      where,
      include: {
        product: true,
        store: true,
        JournalDetail: {
          where: {
            OR: [
              {
                toStoreId: Number(storeId),
              },
              {
                stockJournal: {
                  fromStoreId: Number(storeId),
                },
              },
            ],
          },
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

    const count = await prisma.stockJournal.count({ where });

    return {
      data: stockJournal,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
