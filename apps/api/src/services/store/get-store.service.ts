import prisma from '@/prisma';

export const getStoreService = async (id: number) => {
  try {
    const store = await prisma.store.findFirst({
      where: { id, isDelete: false },
      include: {
        storeProduct: {
          select: {
            qty: true,
          },
        },
        storeAdmin: {
          include: {
            user: true,
          },
        },
        City: {
          include: {
            province: true,
          },
        },
      },
    });

    if (!store) {
      throw new Error('store is not found');
    }

    const totalQty = store.storeProduct.reduce(
      (sum, product) => sum + product.qty,
      0,
    );

    await prisma.store.update({
      where: { id: store.id },
      data: { qty: totalQty },
    });

    return store;
  } catch (error) {
    throw error;
  }
};
