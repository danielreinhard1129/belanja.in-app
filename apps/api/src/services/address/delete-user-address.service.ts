import prisma from '@/prisma';

export const deleteUserAddressService = async (addressId: number) => {
  try {
    const address = await prisma.address.findFirst({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error('Address Not Found!');
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    return {
      message: 'delete address successfull',
    };
  } catch (error) {
    throw error;
  }
};
