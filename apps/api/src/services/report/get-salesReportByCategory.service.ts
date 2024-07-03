import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GetOrderQuery {
  storeId?: string;
  categoryId?: string;
  month?: string;
}

interface UserToken {
  id: number;
}

export const getSalesReportByCategoryService = async (
  query: GetOrderQuery,
  user: UserToken,
) => {
  try {
    const { month, categoryId, storeId } = query;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') {
      throw new Error('Unauthorized access');
    }

    let whereClause: Prisma.OrderWhereInput = {
      createdAt: {
        lte: new Date('2024-07-10'),
        gte: new Date('2024-06-10'),
      },
    };

    if (checkUser.role === 'STOREADMIN') {
      const getStoreAdmin = await prisma.storeAdmin.findFirst({
        where: { userId: checkUser.id },
      });

      if (!getStoreAdmin) {
        throw new Error('You are not a store admin');
      }

      const checkUserStore = await prisma.store.findFirst({
        where: {
          storeAdminId: getStoreAdmin.id,
        },
      });

      if (!checkUserStore) {
        throw new Error('You do not have any store');
      }

      whereClause.storeId = checkUserStore.id;
    } else if (checkUser.role === 'SUPERADMIN' && storeId) {
      whereClause.storeId = Number(storeId);
    }

    if (categoryId) {
      whereClause.OrderItems = {
        some: {
          products: {
            categories: {
              some: {
                categoryId: Number(categoryId),
              },
            },
          },
        },
      };
    }

    const salesReportByCategory = await prisma.order.findMany({
      where: whereClause,
      include: {
        OrderItems: {
          include: {
            products: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    });

    return salesReportByCategory;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};
