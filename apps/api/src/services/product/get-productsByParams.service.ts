import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetProductsByParams extends PaginationQueryParams {
  category?: string;
  search?: string;
}

export const getProductsByParamsService = async (
  query: GetProductsByParams,
) => {
  try {
    const { category, take, page, sortBy, sortOrder, search } = query;

    const where: any = { isDelete: false };

    if (category && category !== 'all') {
      where.categories = {
        some: {
          category: {
            name: category,
          },
        },
      };
    }

    if (search) {
      where.name = {
        contains: search,
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        images: {
          select: {
            images: true,
          },
        },
      },
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const count = await prisma.product.count({ where });

    return {
      data: products,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
