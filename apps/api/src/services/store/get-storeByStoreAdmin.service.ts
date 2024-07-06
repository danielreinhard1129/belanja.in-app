import prisma from '@/prisma';

export const getStoreByStoreAdminService = async (id: number) => {
  try {
    const storeAdmin = await prisma.storeAdmin.findUnique({
      where: { userId: id },
    });

    if (!storeAdmin) {
      throw new Error('Store admin not found');
    }

    const store = await prisma.store.findFirst({
      where: { storeAdminId: storeAdmin.id, isDelete: false },
      include: {
        storeProduct: {
          select: {
            qty: true,
          },
        },
        City: {
          include: {
            province: true,
          },
        },
        storeAdmin: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!store) {
      throw new Error('Store is not found');
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
