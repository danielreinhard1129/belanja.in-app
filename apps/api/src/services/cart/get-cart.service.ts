import prisma from '@/prisma';

export const getCartService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found!');
    }

    const cart = await prisma.cart.findMany({
      where: { userId, isActive: true },
      include: {
        products: { include: { images: true } },
        stores: { include: { City: true } },
      },
    });

    if (!cart) {
      throw new Error('Cart details is missing!');
    }
    return cart;
  } catch (error) {
    throw error;
  }
};
