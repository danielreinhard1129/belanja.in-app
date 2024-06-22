import prisma from '@/prisma';

export const deleteProductService = async (id: number) => {
  try {
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
