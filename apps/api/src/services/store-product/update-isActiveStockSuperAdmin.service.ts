import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const updateIsActiveStockSuperAdminService = async (
  id: number,
  body: { isActive: boolean },
  user: UserToken,
) => {
  try {
    const { isActive } = body;

    const checkUser = await prisma.user.findUnique({
      where: { id: Number(user.id) },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') {
      throw new Error('Unauthorized access');
    }

    const storeProduct = await prisma.storeProduct.findFirst({
      where: { id },
    });

    if (!storeProduct) {
      throw new Error("Can't find store product");
    }

    const updateStoreProduct = await prisma.storeProduct.update({
      where: { id: storeProduct.id },
      data: {
        isActive: isActive,
      },
    });

    return {
      message: 'Store Product has been updated',
      data: updateStoreProduct,
    };
  } catch (error) {
    throw error;
  }
};
