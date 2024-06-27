import prisma from '@/prisma';
import { User } from '@prisma/client';

export const getAddressByUserIdService = async (user: User) => {
  try {
    const findUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { addresses: true },
    });

    if (!findUser) {
      throw new Error('User not found');
    }

    return {
      data: findUser.addresses,
      message: `fetching user with id ${user.id}`,
    };
  } catch (error) {
    throw error;
  }
};
