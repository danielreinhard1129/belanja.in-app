import prisma from '@/prisma';

export const getStoreAdminService = async (id: number) => {
  try {
    const storeAdmin = await prisma.storeAdmin.findFirst({
      where: { id },
    });

    if (!storeAdmin) {
      throw new Error('storeAdmin is not found');
    }

    return storeAdmin;
  } catch (error) {
    throw error;
  }
};
