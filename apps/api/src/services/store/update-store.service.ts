import { OPENCAGE_API_KEY } from '@/config';
import prisma from '@/prisma';
import { Store } from '@prisma/client';
import axios from 'axios';

interface UserToken {
  id: number;
}

interface UpdateStore
  extends Partial<Omit<Store, 'id' | 'updatedAt' | 'qty' | 'createdAt'>> {}

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

export const updateStoreService = async (
  id: number,
  body: UpdateStore,
  user: UserToken,
) => {
  try {
    const { name, cityId, storeAdminId } = body;

    const store = await prisma.store.findFirst({
      where: { id },
    });

    if (!store) {
      throw new Error('Store not found');
    }

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') {
      throw new Error('Unauthorized access');
    }

    if (name) {
      const existingName = await prisma.store.findFirst({
        where: {
          name,
          NOT: { id },
        },
      });

      if (existingName) {
        throw new Error('Name already in use');
      }
    }

    const adminId = storeAdminId ? Number(storeAdminId) : null;

    if (adminId) {
      const existingAdminStore = await prisma.store.findFirst({
        where: {
          storeAdminId: adminId,
          NOT: { id },
        },
      });

      if (existingAdminStore) {
        throw new Error('Store admin is already responsible for another store');
      }
    }

    let lat = store.lat;
    let long = store.long;

    if (cityId && cityId !== store.cityId) {
      const coordinates = await getCoordinates(cityId);
      lat = coordinates.lat;
      long = coordinates.long;
    }

    const updateStore = await prisma.store.update({
      where: { id },
      data: {
        name,
        cityId: cityId ? Number(cityId) : undefined,
        lat,
        long,
        storeAdminId: adminId,
      },
    });

    return { message: 'Update Store Success', data: updateStore };
  } catch (error) {
    throw error;
  }
};
