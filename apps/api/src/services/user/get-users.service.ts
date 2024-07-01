import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetUsersByParams extends PaginationQueryParams {
  search?: string;
  role?: string;
}

export const getUsersService = async (query: GetUsersByParams) => {
  const { take, page, search, role } = query;

  const where: any = {
    isDelete: false,
    role: {
      not: 'SUPERADMIN',
    },
  };

  if (search) {
    where.name = {
      contains: search,
    };
  }

  if (role && role !== 'all') {
    where.role = role;
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
      take,
    });

    const count = await prisma.user.count({ where });

    return {
      data: users,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
