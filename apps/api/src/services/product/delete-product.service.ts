import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const deleteProductService = async (id: number, user: UserToken) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new Error('invalid product id');
    }

    await prisma.product.update({
      where: { id },
      data: { isDelete: true },
    });
  } catch (error) {
    throw error;
  }
};
