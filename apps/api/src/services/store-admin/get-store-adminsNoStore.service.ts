import prisma from '@/prisma';

export const getStoreAdminsNoStoreService = async () => {
  try {
    const storeAdmin = await prisma.storeAdmin.findMany({
      where: {
        stores: null,
      },
      include: {
        user: true,
      },
    });

    if (!storeAdmin) {
      throw new Error('storeAdmin is not found');
    }

    return storeAdmin;
  } catch (error) {
    throw error;
  }
};
