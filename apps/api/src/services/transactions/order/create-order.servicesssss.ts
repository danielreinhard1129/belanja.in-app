import { calculateProductDiscount } from '@/lib/calculateProductDiscount';
import prisma from '@/prisma';
import { IOrderArgs } from '@/types/order.type';
import { Discount, Product, UserVoucher, userDiscount } from '@prisma/client';

interface ProductDiscountMap {
  productId: number;
  originalPrice: number;
  discValue: number;
  total: number;
}

export const createOrderService = async (body: IOrderArgs) => {
  try {
    const { userId, storeId, products, userDiscountIds, userVoucherIds } = body;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new Error('Action not authorized!');
    }

    const productMap = new Map<number, Product>();
    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new Error(`Product with id: ${item.productId} is not found`)
      }
      productMap.set(item.productId, product);
    }
  } catch (error) {
    throw error;
  }
};
