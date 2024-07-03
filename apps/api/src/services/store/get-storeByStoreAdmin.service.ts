import prisma from '@/prisma';

export const getStoreBySuperAdminService = async (id: number) => {
  try {
    const storeAdmin = await prisma.storeAdmin.findUnique({
      where: { userId: id },
    });

    if (!storeAdmin) {
      throw new Error('Store admin not found');
    }

    const store = await prisma.store.findFirst({
      where: { storeAdminId: storeAdmin.id, isDelete: false },
    });

    if (!store) {
      throw new Error('Store is not found');
    }

    return store;
  } catch (error) {
    throw error;
  }
};
