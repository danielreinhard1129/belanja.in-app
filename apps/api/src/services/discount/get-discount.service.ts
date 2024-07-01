import prisma from '@/prisma';

export const getDiscountService = async (id: number) => {
  try {
    const discount = await prisma.discount.findFirst({
      where: { id },
      include: {
        product: true,
        store: true,
      },
    });

    if (!discount) {
      throw new Error('No discount found');
    }
    return discount;
  } catch (error) {
    throw error;
  }
};
