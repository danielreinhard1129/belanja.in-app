import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetStoresByParams extends PaginationQueryParams {
  search?: string;
}

export const getStoresByParamsService = async (query: GetStoresByParams) => {
  const { take, page, search } = query;

  const where: { isDelete: boolean; name?: { contains: string } } = {
    isDelete: false,
  };

  if (search) {
    where.name = {
      contains: search,
    };
  }

  try {
    const stores = await prisma.store.findMany({
      where,
      include: {
        storeAdmin: {
          include: {
            user: true,
          },
        },
        City: true,
      },
      skip: (page - 1) * take,
      take: take,
    });

    if (!stores.length) {
      throw new Error('No stores found');
    }

    const count = await prisma.store.count({ where });

    return {
      data: stores,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
