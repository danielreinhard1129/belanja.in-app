import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

interface GetMostBuyQuery {
  productId?: string;
  storeId?: string;
}

interface UserToken {
  id: number;
}

export const getMostBuyProductService = async (
  query: GetMostBuyQuery,
  user: UserToken,
) => {
  try {
    const { productId, storeId } = query;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error('User not found');
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    let whereClause: Prisma.OrderWhereInput = {
      status: 'ORDER_RECEIVED',
    };

    if (checkUser.role === 'STOREADMIN') {
      const getStoreAdmin = await prisma.storeAdmin.findFirst({
        where: {
          userId: checkUser.id,
        },
      });

      if (!getStoreAdmin) throw new Error('You are not a store admin');

      const checkUserStore = await prisma.store.findFirst({
        where: {
          storeAdminId: getStoreAdmin.id,
        },
      });

      if (!checkUserStore) throw new Error('You do not have any store');

      whereClause.storeId = checkUserStore.id;
    } else if (checkUser.role === 'SUPERADMIN' && storeId) {
      whereClause.storeId = Number(storeId);
    }

    if (productId) {
      whereClause.OrderItems = {
        some: {
          productId: Number(productId),
        },
      };
    }

    const products = await prisma.product.findMany({
      include: {
        images: true,
      },
    });

    const orderCounts = await prisma.orderItems.groupBy({
      by: ['productId'],
      _count: {
        productId: true,
      },
      where: {
        orders: {
          status: 'ORDER_RECEIVED',
          ...(storeId && { storeId: Number(storeId) }),
        },
      },
    });

    const productWithOrderCounts = products.map((product) => {
      const orderCount = orderCounts.find(
        (count: { productId: number }) => count.productId === product.id,
      );
      return {
        ...product,
        orderCount: orderCount ? orderCount._count.productId : 0,
      };
    });

    productWithOrderCounts.sort((a, b) => b.orderCount - a.orderCount);

    return {
      data: productWithOrderCounts,
    };
  } catch (error) {
    throw error;
  }
};
