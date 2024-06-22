import prisma from '@/prisma';

export const getProductsService = async () => {
  try {
    const products = await prisma.product.findMany({
      where: { isDelete: false },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    });

    if (!products) {
      throw new Error('products is not found');
    }

    return products;
  } catch (error) {
    throw error;
  }
};
