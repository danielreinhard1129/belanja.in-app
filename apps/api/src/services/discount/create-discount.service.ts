import prisma from '@/prisma';
import { Discount } from '@prisma/client';

interface CreateDiscount extends Omit<Discount, 'id' | 'storeId'> {}

interface UserToken {
  id: number;
}

export const createDiscountService = async (
  body: CreateDiscount,
  user: UserToken,
) => {
  try {
    const {
      title,
      desc,
      discountType,
      discountvalue,
      // discountLimit,
      productId,
      minPurchase,
    } = body;

    // Cari user berdasarkan user.id
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    // Cari storeAdmin berdasarkan user.id
    const storeAdmin = await prisma.storeAdmin.findUnique({
      where: {
        userId: Number(user.id),
      },
    });

    if (!storeAdmin) {
      throw new Error("Can't find store admin associated with your account");
    }

    // Cari store berdasarkan storeAdmin.id
    const store = await prisma.store.findUnique({
      where: {
        storeAdminId: storeAdmin.id,
      },
    });

    if (!store) {
      throw new Error("Can't find store associated with your account");
    }

    // Buat discount baru
    // const createDiscount = await prisma.discount.create({
    //   data: {
    //     title,
    //     desc,
    //     discountType: discountType,
    //     discountvalue: Number(discountvalue),
    //     discountLimit: Number(discountLimit),
    //     minPurchase: Number(minPurchase),
    //     isActive: true,
    //     storeId: store.id,
    //     productId: Number(productId),
    //   },
    // });

    return {
      message: 'Discount has been created',
      // data: createDiscount,
    };
  } catch (error) {
    throw error;
  }
};
