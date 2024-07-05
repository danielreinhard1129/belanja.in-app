import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetDiscountsByStore extends PaginationQueryParams {
  storeId?: string;
}

interface UserToken {
  id: number;
}

export const getDiscountsBySuperAdminService = async (
  query: GetDiscountsByStore,
  userToken: UserToken,
) => {
  const { take, page, storeId } = query;
  const userId = Number(userToken.id);

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("Can't find your account");
  }

  if (user.role !== 'SUPERADMIN') {
    throw new Error('You do not have access');
  }

  let where: any = {
    isDelete: false,
  };

  if (storeId && storeId !== 'all') {
    where.storeId = Number(storeId);
  }

  try {
    const discounts = await prisma.discount.findMany({
      where,
      include: {
        product: true,
        store: true,
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
