import prisma from '@/prisma';

export const getAddressByIdService = async (addressId: number) => {
  try {
    const address = await prisma.address.findFirst({
      where: { id: addressId, isDelete: false },
    });

    if (!address) {
      throw new Error('address not found');
    }

    return address;
  } catch (error) {
    throw error;
  }
};
