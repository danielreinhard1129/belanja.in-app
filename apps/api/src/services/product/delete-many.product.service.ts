import prisma from '@/prisma';

export const deleteManyProductsService = async (productId: number[]) => {
  try {
    // Validasi apakah array productId tidak kosong
    if (productId.length === 0) {
      throw new Error('productId array is empty');
    }

    // Update banyak produk dengan array productId
    await prisma.product.updateMany({
      where: {
        id: {
          in: productId,
        },
      },
      data: {
        isDelete: true,
      },
    });
  } catch (error) {
    throw error;
  }
};
