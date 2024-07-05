import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetDiscountsByDiscountType extends PaginationQueryParams {
  discountType?: string;
}

interface UserToken {
  id: number;
}

export const getDiscountsByStoreAdminService = async (
  query: GetDiscountsByDiscountType,
  userToken: UserToken,
) => {
  try {
    const { take, page, discountType } = query;
    const userId = Number(userToken.id);

    // Cari user beserta informasi storeAdmin dan stores-nya
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: {
        storeAdmin: {
          include: {
            stores: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Can't find your account");
    }

    if (user.role === 'USER') {
      throw new Error('You do not have access');
    }

    const storeAdmin = await prisma.storeAdmin.findUnique({
      where: { userId: user.id },
    });

    if (!storeAdmin) {
      throw new Error('Store admin not found');
    }

    const store = await prisma.store.findFirst({
      where: { storeAdminId: storeAdmin.id },
    });

    if (!store) {
      throw new Error('store is not found');
    }

    const where: any = {
      storeId: store.id,
      isDelete: false,
    };

    if (discountType && discountType !== 'all') {
      where.discountType = discountType;
    }

    const discounts = await prisma.discount.findMany({
      where,
      include: {
        store: true,
        product: true,
      },
      skip: (page - 1) * take,
      take,
    });

    const count = await prisma.discount.count({ where });

    return {
      data: discounts,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
