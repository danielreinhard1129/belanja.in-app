import prisma from '@/prisma';
import { Store } from '@prisma/client';

interface CreateStore
  extends Omit<Store, 'id' | 'updatedAt' | 'qty' | 'createdAt'> {
  user: {
    id: number;
  };
}

export const createStoreService = async (body: CreateStore) => {
  try {
    const { name, cityId, lat, long, storeAdminId, user } = body;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    const existingName = await prisma.store.findFirst({
      where: {
        name,
      },
    });

    if (existingName) throw new Error('Name already exist');

    // Tentukan nilai storeAdminId
    const adminId = storeAdminId ? Number(storeAdminId) : null;

    const createStore = await prisma.store.create({
      data: {
        name: name,
        cityId: cityId,
        lat: lat,
        long: long,
        storeAdminId: adminId,
      },
    });

    return { message: 'Create Store Success', data: createStore };
  } catch (error) {
    throw error;
  }
};
