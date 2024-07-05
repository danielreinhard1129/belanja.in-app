import prisma from '@/prisma';
import { Address } from '@prisma/client';

interface FormUpdateAddressArgs {
  addressLine: string;
  postalCode: number;
  provinceId: number;
  cityId: number;
  subdistrictId: number;
  lat: number;
  long: number;
  isPrimary: boolean;
}

export const updateUserAddressService = async (
  addressId: number,
  body: Partial<FormUpdateAddressArgs>,
) => {
  try {
    const { isPrimary } = body;

    const address = await prisma.address.findFirst({
      where: { id: addressId },
    });

    if (!address) {
      throw new Error('Address not found!');
    }

    if (isPrimary) {
      await prisma.address.updateMany({
        where: { userId: address.userId },
        data: {
          isPrimary: false,
        },
      });
    }

    console.log("payload", body)

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        addressLine: body.addressLine,
        cityId:
          typeof body.cityId === 'string' ? parseInt(body.cityId) : body.cityId,
        provinceId:
          typeof body.provinceId === 'string'
            ? parseInt(body.provinceId)
            : body.provinceId,
        subdistrictId:
          typeof body.subdistrictId === 'string'
            ? parseInt(body.subdistrictId)
            : body.subdistrictId,
        postalCode:
          typeof body.postalCode === 'string'
            ? parseInt(body.postalCode)
            : body.postalCode,
        lat: typeof body.lat === 'string' ? parseInt(body.lat) : body.lat,
        long: typeof body.long === 'string' ? parseInt(body.long) : body.long,
        isPrimary:
          typeof body.isPrimary === 'string' ? body.isPrimary === 'true' : body.isPrimary,
      },
    });

    console.log('Updated Address:', updatedAddress);

    return {
      message: 'Update User Address Successful!',
      data: updatedAddress,
    };
  } catch (error) {
    throw error;
  }
};
