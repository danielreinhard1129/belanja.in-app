import { startOfMonth, endOfMonth, getYear, getMonth } from 'date-fns';
import prisma from '@/prisma';

interface GetOrderQuery {
  storeId?: string;
  productId?: string;
  month?: string;
}

interface UserToken {
  id: number;
}

export const getSalesReportByProductService = async (
  query: GetOrderQuery,
  user: UserToken,
) => {
  try {
    const { month, storeId, productId } = query;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    let whereClause: any = {
      createdAt: {
        lte: new Date('2024-07-10'),
        gte: new Date('2024-06-10'),
      },
    };

    if (checkUser.role === 'STOREADMIN') {
      const getStoreAdmin = await prisma.storeAdmin.findFirst({
        where: { userId: checkUser.id },
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
      whereClause.OrderItems.some.productId = Number(productId);
    }

    const salesReportByProduct = await prisma.order.findMany({
      where: whereClause,
      include: {
        OrderItems: {
          include: {
            products: true,
          },
        },
      },
    });

    return salesReportByProduct;
  } catch (error) {
    throw error;
  }
};
