import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { OrderStatus, Prisma } from '@prisma/client';

interface GetOrdersQuery extends PaginationQueryParams {
  id: number;
  search: string;
  status: OrderStatus;
}

export const getOrdersByUserId = async (query: GetOrdersQuery) => {
  try {
    const { page, search, sortBy, sortOrder, take, id, status } = query;

    const whereClause: Prisma.OrderWhereInput = {
      status: status,
      userId: id,
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
            products: true,
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
