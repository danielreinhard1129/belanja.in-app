import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const getVouchersByStoreAdminService = async (userToken: UserToken) => {
  try {
    const userId = Number(userToken.id);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
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

    // const store = await prisma.store.findFirst({
    //   where: { storeAdminId: storeAdmin.id },
    // });

    // if (!store) {
    //   throw new Error('store is not found');
    // }

    const vouchers = await prisma.voucher.findMany({
      //   where: {
      //     storeId: store.id,
      //   },
      include: {
        products: true,
      },
    });

    return vouchers;
  } catch (error) {
    throw error;
  }
};
