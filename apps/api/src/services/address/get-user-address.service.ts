import prisma from '@/prisma';

export const getUserAddressService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found!');
    }

    const data = await prisma.address.findMany({
      where: { userId },
      include: {
        user: true,
        cities: { include: { province: true } },
        subdistricts: true,
      },
    });

    const addresses = data.map((data, index) => {
      return { ...data, isSelected: false };
    });

    return addresses;
  } catch (error) {
    throw error;
  }
};