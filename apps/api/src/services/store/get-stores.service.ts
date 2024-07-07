import prisma from '@/prisma';

export const getStoresService = async () => {
  try {
    const stores = await prisma.store.findMany({
      where: { isDelete: false },
      include: {
        storeProduct: {
          select: {
            qty: true,
          },
        },
      },
    });

    if (!stores) {
      throw new Error('stores not found');
    }

    await Promise.all(
      stores.map(async (store) => {
        const totalQty = store.storeProduct.reduce(
          (sum, product) => sum + product.qty,
          0,
        );

        await prisma.store.update({
          where: { id: store.id },
          data: { qty: totalQty },
        });
      }),
    );

    return stores;
  } catch (error) {
    throw error;
  }
};
