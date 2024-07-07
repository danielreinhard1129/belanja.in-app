import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetStockJournalsByParams extends PaginationQueryParams {
  search?: string;
  status?: string;
  storeId?: string;
  filterMonth?: string;
  filterYear?: string;
}

interface UserToken {
  id: number;
}

export const getStockJournalsByStoreWithParamsService = async (
  userToken: UserToken,
  query: GetStockJournalsByParams,
) => {
  const { take, page, storeId, status, search, filterMonth, filterYear } =
    query;
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
    throw new Error('You do not have access');
  }

  let where: any = {};

  if (status && status !== 'all') {
    where.status = status;
  }

  if (storeId && storeId !== 'all') {
    where = {
      ...where,
      OR: [
        { storeId: Number(storeId) },
        { toStoreId: Number(storeId) },
        { fromStoreId: Number(storeId) },
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

  if (search && search !== '') {
    where = {
      ...where,
      product: {
        name: {
          contains: search,
        },
      },
    };
  }

  if (filterMonth && filterYear) {
    const startDate = new Date(Number(filterYear), Number(filterMonth) - 1, 1);
    const endDate = new Date(Number(filterYear), Number(filterMonth), 0);

    where = {
      ...where,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };
  } else if (filterYear) {
    const startDate = new Date(Number(filterYear), 0, 1);
    const endDate = new Date(Number(filterYear), 11, 31);

    where = {
      ...where,
      createdAt: {
        gte: startDate,
        lte: endDate,
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

    const count = await prisma.stockJournal.count({ where });

    return {
      data: stockJournal,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
