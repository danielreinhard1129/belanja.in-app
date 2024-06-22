import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const deleteManyProductsService = async (
  productId: number[],
  user: UserToken,
) => {
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
