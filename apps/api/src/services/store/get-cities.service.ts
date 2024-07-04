import prisma from '@/prisma';

export const getCitiesService = async () => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        province: true,
        subdistricts: true,
      },
    });
    if (!cities) {
      throw new Error('No cities found');
    }

    return cities;
  } catch (error) {
    throw error;
  }
};
