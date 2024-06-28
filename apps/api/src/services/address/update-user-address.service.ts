import prisma from '@/prisma';
import { Address } from '@prisma/client';

export const updateUserAddressService = async (
  addressId: number,
  body: Partial<Address>,
) => {
  try {
    const { isPrimary, userId } = body;
    const address = await prisma.address.findFirst({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error('Address not found!');
    }

    if (isPrimary) {
      await prisma.address.updateMany({
        where: { userId },
        data: {
          isPrimary: false,
        },
      });
    }

    const update = await prisma.address.update({
      where: { id: address.id },
      data: {
        ...body,
      },
    });

    return {
      message: 'Update User Address Successfull!',
      data: update,
    };
  } catch (error) {
    throw error;
  }
};
