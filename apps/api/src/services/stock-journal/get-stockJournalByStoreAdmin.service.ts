import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetStockJournalByParams extends PaginationQueryParams {
  search?: string;
  status?: string;
}

interface UserToken {
  id: number;
}

export const getStockJournalByStoreAdminService = async (
  userToken: UserToken,
  query: GetStockJournalByParams,
) => {
  const { search, take, page, status } = query;
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

  let where: any = {
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
  };

  if (status && status !== 'all') {
    where.status = status;
  }

  // Kondisi pencarian produk
  if (search) {
    where = {
      product: {
        name: {
          contains: search,
        },
      },
    };
  }

  try {
    const stockJournal = await prisma.stockJournal.findMany({
      where,
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
      where,
    });

    return {
      data: stockJournal,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
