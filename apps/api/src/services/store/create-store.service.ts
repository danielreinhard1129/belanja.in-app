import axios from 'axios';
import prisma from '@/prisma';
import { Store } from '@prisma/client';
import { OPENCAGE_API_KEY } from '@/config';

interface CreateStore
  extends Omit<
    Store,
    'id' | 'updatedAt' | 'qty' | 'createdAt' | 'lat' | 'long'
  > {}

interface UserToken {
  id: number;
}

const getCoordinates = async (
  cityId: number,
): Promise<{ lat: number; long: number }> => {
  const city = await prisma.city.findUnique({
    where: {
      id: Number(cityId),
    },
  });

  if (!city || !city.citName) {
    throw new Error('City not found or citName is null');
  }

  const response = await axios.get(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city.citName)}&key=${OPENCAGE_API_KEY}`,
  );

  if (response.data.results.length === 0) {
    throw new Error('Location not found');
  }

  const { lat, lng } = response.data.results[0].geometry;
  return { lat, long: lng };
};

export const createStoreService = async (
  body: CreateStore,
  user: UserToken,
) => {
  try {
    const { name, cityId, storeAdminId } = body;

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

    const adminId = storeAdminId ? Number(storeAdminId) : null;

    if (adminId) {
      const existingAdminStore = await prisma.store.findFirst({
        where: {
          storeAdminId: adminId,
        },
      });

      if (existingAdminStore) {
        throw new Error('Store admin is already responsible for another store');
      }
    }

    const { lat, long } = await getCoordinates(cityId);

    if (existingName) {
      if (existingName.isDelete) {
        const reactivatedStore = await prisma.store.update({
          where: {
            id: existingName.id,
          },
          data: {
            name,
            cityId: Number(cityId),
            lat: lat,
            long: long,
            storeAdminId: adminId,
            isDelete: false,
          },
        });

        return {
          message: 'Store has been reactivated',
          data: reactivatedStore,
        };
      } else {
        throw new Error('Store name already used');
      }
    }

    const createStore = await prisma.store.create({
      data: {
        name: name,
        cityId: Number(cityId),
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
