import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetUsersByParams extends PaginationQueryParams {
  search?: string;
}

export const getUsersService = async (query: GetUsersByParams) => {
  const { take, page, search } = query;

  const where: { name?: { contains: string } } = {};

  if (search) {
    where.name = {
      contains: search,
    };
  }

  try {
    const users = await prisma.user.findMany({
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

    if (!users.length) {
      throw new Error('No user found');
    }

    const count = await prisma.user.count({ where });

    return {
      data: users,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
