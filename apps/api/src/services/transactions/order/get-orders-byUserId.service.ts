import prisma from '@/prisma';
import { DateRange } from '@/types/date-range.type';
import { PaginationQueryParams } from '@/types/pagination.type';
import { OrderStatus, Prisma } from '@prisma/client';

interface GetOrdersQuery extends PaginationQueryParams {
  id: number;
  search: string;
  status: OrderStatus | undefined;
  category: string;
  toDate: string;
  fromDate: string;
}

export const getOrdersByUserId = async (query: GetOrdersQuery) => {
  try {
    const {
      page,
      search,
      sortBy,
      sortOrder,
      take,
      id,
      status,
      category,
      fromDate,
      toDate,
    } = query;

    const categoryArgs = category && category === 'all' ? undefined : category;
    const dateRangeArgs = {
      from: !fromDate ? undefined : new Date(fromDate),
      to: !toDate ? undefined : new Date(toDate),
    };

    const whereClause: Prisma.OrderWhereInput = {
      status: status,
      userId: id,
      orderNumber: { contains: search },
      updatedAt: { gte: dateRangeArgs.from, lte: dateRangeArgs.to },
      
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
        stores: { include: { City: true } },
        Payment: true,
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
