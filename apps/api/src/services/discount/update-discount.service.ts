import prisma from '@/prisma';
import { Discount } from '@prisma/client';

interface UserToken {
  id: number;
}

export const updateDiscountService = async (
  id: number,
  body: Omit<Discount, 'id'>,
  user: UserToken,
) => {
  try {
    const {
      title,
      desc,
      discountType,
      discountvalue,
      discountLimit,
      productId,
      minPurchase,
      storeId,
    } = body;

    // Check if the requesting user exists and is a SUPERADMIN
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') {
      throw new Error('Unauthorized access');
    }

    const updateDiscount = await prisma.discount.update({
      where: { id },
      data: {
        title,
        desc,
        discountType: discountType,
        discountvalue: Number(discountvalue),
        discountLimit: Number(discountLimit),
        minPurchase: Number(minPurchase),
        isActive: true,
        storeId: Number(storeId),
        // productId: Number(productId),
        productId: 1,
      },
    });

    return updateDiscount;
  } catch (error) {
    throw error;
  }
};
