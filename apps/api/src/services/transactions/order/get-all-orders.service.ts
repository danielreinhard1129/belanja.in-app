import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { OrderStatus, Prisma } from '@prisma/client';

interface GetOrdersQuery extends PaginationQueryParams {
  search: string;
  status: OrderStatus | undefined;
  category: string;
//   startDate : Date

}

export const getAllOrdersService = async (query: GetOrdersQuery) => {
  try {
    const { page, search, sortBy, sortOrder, take, status, category } =
      query;

      
      const categoryArgs = category && category === "all" ? undefined : category
      
    const whereClause: Prisma.OrderWhereInput = {
      status: status,
      OrderItems: {
        some: {
          products: {
            name: { contains: search },
            categories: {
              some: { category: { name: { contains: categoryArgs } } },
            },
          },
        },
      },
    };

    const orders = await prisma.order.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        OrderItems: {
          include: {
            products: { include: { images: true } },
          },
        },
      },
    });
    if (!orders) {
      throw new Error('User/orders not exist');
    }

    const count = await prisma.order.count({ where: whereClause });

    return {
      data: orders,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
