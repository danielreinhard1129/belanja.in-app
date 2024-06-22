import prisma from '@/prisma';

export const getProductService = async (id: number) => {
  try {
    const product = await prisma.product.findFirst({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    });

    if (!product) {
      throw new Error('product is not found');
    }

    return product;
  } catch (error) {
    throw error;
  }
};
