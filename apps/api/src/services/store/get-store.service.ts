import prisma from '@/prisma';

export const getStoreService = async (id: number) => {
  try {
    const store = await prisma.store.findFirst({
      where: { id },
      include: {
        storeAdmin: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!store) {
      throw new Error('store is not found');
    }

    return store;
  } catch (error) {
    throw error;
  }
};
