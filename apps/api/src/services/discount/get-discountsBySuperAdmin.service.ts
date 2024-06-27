import prisma from '@/prisma';

interface GetDiscountsByStore {
  storeId?: string;
}

interface UserToken {
  id: number;
}

export const getDiscountsBySuperAdminService = async (
  query: GetDiscountsByStore,
  userToken: UserToken,
) => {
  const { storeId } = query;
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

  let where: any = {};

  if (storeId && storeId !== '') {
    where.storeId = Number(storeId);
  }

  try {
    const discounts = await prisma.discount.findMany({
      where,
      include: {
        product: true,
        store: true,
      },
    });

    return discounts;
  } catch (error) {
    throw error;
  }
};
