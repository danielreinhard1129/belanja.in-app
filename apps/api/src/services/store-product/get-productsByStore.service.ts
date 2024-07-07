import prisma from '@/prisma';

export const getProductsByStoreService = async (id: number) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        storeProduct: {
          some: {
            storeId: id,
          },
        },
      },
    });
    if (!products) {
      throw new Error('No product found for this store');
    }
    return products;
  } catch (error) {
    throw error;
  }
};
