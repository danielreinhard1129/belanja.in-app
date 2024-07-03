import prisma from '@/prisma';
import { Address } from '@prisma/client';

export const addUserAddressService = async (body: Omit<Address, 'id'>) => {
  try {
    const { userId, postalCode } = body;
    const findAddress = await prisma.address.findMany({
      where: { userId },
    });

    const isPrimary = !findAddress.length;

    const newAddress = await prisma.address.create({
      data: {
        ...body,
        postalCode: Number(postalCode),
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
