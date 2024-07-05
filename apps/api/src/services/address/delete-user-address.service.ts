import prisma from '@/prisma';

export const deleteUserAddressService = async (addressId: number) => {
  try {
    const address = await prisma.address.findFirst({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error('Address Not Found!');
    }

    if (address.isPrimary) {
      const firstAddress = await prisma.address.findFirst({
        where: {
          userId: address.userId,
          id: {
            not: addressId,
          },
        },
        orderBy: {
          id: 'asc',
        },
      });

      if (firstAddress) {
        await prisma.address.update({
          where: { id: firstAddress.id },
          data: { isPrimary: true },
        });
      }
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
