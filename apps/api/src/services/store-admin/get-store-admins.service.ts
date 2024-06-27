import prisma from '@/prisma';

export const getStoreAdminsService = async () => {
  try {
    const storeAdmin = await prisma.storeAdmin.findMany({
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
