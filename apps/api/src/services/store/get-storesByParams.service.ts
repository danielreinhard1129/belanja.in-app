import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetProductsByParams extends PaginationQueryParams {
  search?: string;
}

export const getStoresByParamsService = async (query: GetProductsByParams) => {
  const { take, page, search } = query;

  const where: { name?: { contains: string } } = {};

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
