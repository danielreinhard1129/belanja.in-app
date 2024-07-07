import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { OrderStatus, Prisma } from '@prisma/client';

interface GetOrdersQuery extends PaginationQueryParams {
  id: number;
  search: string;
  status: OrderStatus | undefined;
  category: string;
  toDate: string;
  fromDate: string;
  storeId: string;
}

export const getAllOrdersService = async (query: GetOrdersQuery) => {
  try {
    const {
      id,
      page,
      search,
      sortBy,
      sortOrder,
      take,
      status,
      category,
      fromDate,
      toDate,
      storeId,
    } = query;

    const admin = await prisma.user.findFirst({
      where: { id },
      include: {
        storeAdmin: { include: { stores: { select: { id: true } } } },
      },
    });

    const storeIdSuperAdmin =
      storeId && storeId === 'all' ? undefined : parseInt(storeId, 10);

    const storeIdStoreAdmin = admin?.storeAdmin?.stores?.id;

    const storeIdArgs =
      admin?.role === 'SUPERADMIN'
        ? storeIdSuperAdmin
        : admin?.role === 'STOREADMIN'
          ? storeIdStoreAdmin
          : undefined;

    const categoryArgs = category && category === 'all' ? undefined : category;

    const dateRangeArgs = {
      from: !fromDate ? undefined : new Date(fromDate),
      to: !toDate ? undefined : new Date(toDate),
    };

    const whereClause: Prisma.OrderWhereInput = {
      status: status,
      storeId: storeIdArgs,
      orderNumber: { contains: search },
      updatedAt: { gte: dateRangeArgs.from, lte: dateRangeArgs.to },
      OrderItems: {
        every: {
          products: {
            categories: { every: { category: { name: categoryArgs } } },
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
        stores: { include: { City: true } },
        Payment: true,
        users: true,
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
