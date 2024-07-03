import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetStockJournalsByParams extends PaginationQueryParams {
  search?: string;
  status?: string;
  storeId?: string;
}

interface UserToken {
  id: number;
}

export const getStockJournalsByStoreSuperAdminService = async (
  userToken: UserToken,
  query: GetStockJournalsByParams,
) => {
  const { take, page, storeId, status } = query;
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

  if (user.role !== 'SUPERADMIN') {
    throw new Error('You do not have access');
  }

  let where: any = {};

  // Filter berdasarkan status jika didefinisikan
  if (status && status !== 'all') {
    where.status = status;
  }

  // Filter berdasarkan storeId jika didefinisikan
  if (storeId && storeId !== '') {
    where.storeId = Number(storeId);
  }

  // Filter berdasarkan tipe jurnal INCREASE dan DECREASE
  where.type = {
    in: ['INCREASE', 'DECREASE'],
  };

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

    const count = await prisma.stockJournal.count({ where });

    return {
      data: stockJournal,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
