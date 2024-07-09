import prisma from '@/prisma';
import { Address } from '@prisma/client';

export const addUserAddressService = async (body: Omit<Address, 'id'>) => {
  try {
    const { userId, postalCode } = body;
    const findAddress = await prisma.address.findMany({
      where: { userId },
    });

    const countIsDelete = await prisma.address.count({
      where: { userId, isDelete: false },
    });

    if (countIsDelete >= 5) {
      throw new Error(
        'You reach maximum address limit. If you want to add more address, please delete the other.',
      );
    }

    const isPrimary = findAddress.length !== 0;

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
