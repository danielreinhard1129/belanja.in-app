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
  const { userId, storeId, products, userDiscountIds, userVoucherIds } = body;

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { addresses: true },
    });

    // Create initial order
    const newOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        totalAmount: 0, // This will be updated after calculating total
        totalWeight: 0, // this will be updated after calculating total
        status: 'WAITING_FOR_PAYMENT',
      },
      include: {
        OrderItems: true,
      },
    });

    let totalAmount = 0;
    let discountValue = 0;
    let orderTotalWeight = 0;

    // Apply product discounts and calculate the total amount
    for (const item of products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error('Product not found');

      const originalPrice = product.price * item.qty;
      let discValue = 0;

      //coba ryan
      //create initial orderItem
      const newOrderItem = await prisma.orderItems.create({
        data: {
          orderId: newOrder.id,
          productId: item.productId,
          qty: item.qty,
          total: originalPrice - discValue,
          discValue,
          originalPrice: product.price,
          totalWeight: product.weight * item.qty,
        },
      });
      orderTotalWeight += newOrderItem.totalWeight!;
      //coba ryan
      // Apply product-based discounts
      if (userDiscountIds && userDiscountIds.length) {
        const userDiscounts = await prisma.userDiscount.findMany({
          where: { id: { in: userDiscountIds }, isUsed: false },
          include: { discounts: true },
        });

        for (const userDiscount of userDiscounts) {
          const discount = userDiscount.discounts;
          if (
            discount.discountType === 'PRODUCT' &&
            discount.productId === item.productId
          ) {
            discValue +=
              ((product.price * discount.discountvalue) / 100) * item.qty;
            //coba ryan

            await prisma.orderItems.update({
              where: { id: newOrderItem.id },
              data: { userDiscountId: userDiscount.id },
            });
            //coba ryan
          }
        }
      }

      // Apply product-specific vouchers
      if (userVoucherIds && userVoucherIds.length) {
        const userVouchers = await prisma.userVoucher.findMany({
          where: { id: { in: userVoucherIds }, isUsed: false },
          include: { vouchers: true },
        });

        for (const userVoucher of userVouchers) {
          const voucher = userVoucher.vouchers;
          if (
            voucher.voucherType === 'PRODUCT' &&
            voucher.productId === item.productId
          ) {
            discValue +=
              ((product.price * voucher.discountValue) / 100) * item.qty;
            //coba
            await prisma.orderItems.update({
              where: { id: newOrderItem.id },
              data: { userVoucherId: userVoucher.id },
            });
          }
        }
      }

      totalAmount += originalPrice - discValue;
      discountValue += discValue;

      //coba ryan

      await prisma.orderItems.update({
        where: { id: newOrderItem.id },
        data: {
          productId: item.productId,
          qty: item.qty,
          total: originalPrice - discValue,
          discValue,
          originalPrice: product.price,
        },
      });
    }

    // Apply min purchase discounts
    if (userDiscountIds && userDiscountIds.length) {
      const userDiscounts = await prisma.userDiscount.findMany({
        where: { id: { in: userDiscountIds }, isUsed: false },
        include: { discounts: true },
      });

      for (const userDiscount of userDiscounts) {
        const discount = userDiscount.discounts;
        if (
          discount.discountType === 'MIN_PURCHASE' &&
          totalAmount >= discount.minPurchase!
        ) {
          discountValue += (totalAmount * discount.discountvalue) / 100;
          await prisma.order.update({
            where: { id: newOrder.id },
            data: { userDiscountId: userDiscount.id },
          });
        }
      }
    }

    // Apply purchase vouchers
    if (userVoucherIds && userVoucherIds.length) {
      const userVouchers = await prisma.userVoucher.findMany({
        where: { id: { in: userVoucherIds }, isUsed: false },
        include: { vouchers: true },
      });

      for (const userVoucher of userVouchers) {
        const voucher = userVoucher.vouchers;
        if (
          voucher.voucherType === 'PURCHASE' &&
          totalAmount >= voucher.discountValue
        ) {
          discountValue += (totalAmount * voucher.discountValue) / 100;
          await prisma.order.update({
            where: { id: newOrder.id },
            data: { userVoucherId: userVoucher.id },
          });
        }
      }
    }

    totalAmount -= discountValue;

    // Update order totalAmount
    await prisma.order.update({
      where: { id: newOrder.id },
      data: { totalAmount, totalWeight: orderTotalWeight },
    });

    const order = await prisma.order.findFirst({
      where: { id: newOrder.id },
      include: { OrderItems: true },
    });
    return { message: 'Order created successfully', order };
  } catch (error) {
    throw error;
  }
};
