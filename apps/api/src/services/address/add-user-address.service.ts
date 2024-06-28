import prisma from '@/prisma';
import { Address } from '@prisma/client';

export const addUserAddressService = async (body: Omit<Address, 'id'>) => {
  try {
    const { userId } = body;
    const findAddress = await prisma.address.findMany({
      where: { userId },
    });

    const isPrimary = !findAddress.length

    const newAddress = await prisma.address.create({
      data: {
        ...body,
        isPrimary,
      },
    });

    return {
      message: 'Add Address Success!',
      data: newAddress,
    };
  } catch (error) {
    throw error;
  }
};
