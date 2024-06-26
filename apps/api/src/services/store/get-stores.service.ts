import prisma from '@/prisma';

export const getStoresService = async () => {
  try {
    const stores = await prisma.store.findMany();

    if (!stores) {
      throw new Error('stores not found');
    }

    return stores;
  } catch (error) {
    throw error;
  }
};