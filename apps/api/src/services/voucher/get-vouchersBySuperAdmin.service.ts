import prisma from '@/prisma';

interface GetVouchersByStore {
  storeId?: string;
}

interface UserToken {
  id: number;
}

export const getVouchersBySuperAdminService = async (
  query: GetVouchersByStore,
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

  // let where: any = {};

  // if (storeId && storeId !== '') {
  //   where.storeId = Number(storeId);
  // }

  try {
    const vouchers = await prisma.voucher.findMany({
      // where,
      include: {
        products: true,
      },
    });

    return vouchers;
  } catch (error) {
    throw error;
  }
};
