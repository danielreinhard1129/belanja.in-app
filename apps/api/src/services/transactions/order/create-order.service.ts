import {
  MIDTRANS_CLIENT_KEY,
  MIDTRANS_SERVER_KEY,
  NEXT_BASE_URL,
} from '@/config';
import { calculateProductDiscount } from '@/lib/calculateProductDiscount';
import prisma from '@/prisma';
import { IOrderArgs, PaymentMethodArgs } from '@/types/order.type';
import {
  Discount,
  Prisma,
  Product,
  UserVoucher,
  userDiscount,
} from '@prisma/client';
import { MidtransClient } from 'midtrans-node-client';

export const createOrderService = async (body: IOrderArgs) => {
  const {
    userId,
    storeId,
    products,
    userDiscountIds,
    userVoucherIds,
    addressId,
    deliveryFee,
    paymentMethod,
    deliveryService,
    deliveryCourier,
  } = body;

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { addresses: true },
    });

    if (!user) {
      throw new Error('User Not Found!');
    }

    const padNumber = (num: number, size: number): string => {
      let s = num.toString();
      while (s.length < size) s = '0' + s;
      return s;
    };

    const getNextNumber = (lastReferenceNumber: string | undefined) => {
      if (!lastReferenceNumber) {
        return padNumber(1, 4);
      }
      const numberParts = lastReferenceNumber.split('-');
      const lastPart = numberParts.pop();
      if (!lastPart) {
        throw new Error('Invalid number format');
      }
      const lastNumber = parseInt(lastPart, 10);
      if (isNaN(lastNumber)) {
        throw new Error('Last part of the number is not a valid number');
      }
      return padNumber(lastNumber + 1, 4);
    };

    const lastOrderNumber = await prisma.order.findFirst({
      where: {
        orderNumber: {
          contains: `ORD-${padNumber(user.id, 4)}-${padNumber(storeId, 3)}-`,
        },
      },
      orderBy: {
        orderNumber: 'desc',
      },
    });

    const nextOrderNumber = getNextNumber(lastOrderNumber?.orderNumber);
    const orderNumber = `ORD-${padNumber(user.id, 4)}-${padNumber(storeId, 3)}-${nextOrderNumber}`;

    // Create initial order
    const newOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        totalAmount: 0, // This will be updated after calculating total
        totalWeight: 0, // this will be updated after calculating total
        status: 'WAITING_FOR_PAYMENT',
        orderNumber,
      },
      include: {
        OrderItems: true,
      },
    });
    const lastInvoiceNumber = await prisma.payment.findFirst({
      where: {
        invoiceNumber: {
          contains: `IN-${padNumber(user.id, 4)}-${padNumber(newOrder.id, 3)}-`,
        },
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
    });
    const nextInvoiceNumber = getNextNumber(lastInvoiceNumber?.invoiceNumber);
    const invoiceNumber = `IN-${padNumber(user.id, 4)}-${padNumber(newOrder.id, 3)}-${nextInvoiceNumber}`;

    const lastDeliveryNumber = await prisma.delivery.findFirst({
      where: {
        deliveryNumber: {
          contains: `DLV-${padNumber(user.id, 4)}-${padNumber(storeId, 3)}-`,
        },
      },
      orderBy: {
        deliveryNumber: 'desc',
      },
    });
    const nextDeliveryNumber = getNextNumber(
      lastDeliveryNumber?.deliveryNumber,
    );
    const deliveryNumber = `DLV-${padNumber(user.id, 4)}-${padNumber(newOrder.id, 3)}-${nextDeliveryNumber}`;

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

    if (!order) {
      throw new Error('Order not found');
    }
    const newDelivery = await prisma.delivery.create({
      data: {
        deliveryNumber,
        addressId,
        deliveryFee: Number(deliveryFee),
        orderId: order?.id,
        storeId,
        status: 'PENDING',
        deliveryService,
        deliveryCourier,
      },
    });

    if (paymentMethod === PaymentMethodArgs.DIGITAL_PAYMENT) {
      const snap = new MidtransClient.Snap({
        isProduction: false,
        clientKey: MIDTRANS_CLIENT_KEY,
        serverKey: MIDTRANS_SERVER_KEY,
      });
      const payload: {
        transaction_details: {
          order_id: string;
          gross_amount: number;
        };
        callback: { finish: string; error: string; pending: string };
      } = {
        transaction_details: {
          order_id: order.orderNumber,
          gross_amount: order.totalAmount + newDelivery.deliveryFee,
        },
        callback: {
          finish: `${NEXT_BASE_URL}/order/order-details/${order.id}`,
          error: `${NEXT_BASE_URL}/order/order-details/${order.id}`,
          pending: `${NEXT_BASE_URL}/order/order-details/${order.id}`,
        },
      };
      const transaction = await snap.createTransaction(payload);

      const newInvoice = await prisma.payment.create({
        data: {
          amount: order.totalAmount + newDelivery.deliveryFee,
          invoiceNumber,
          paymentMethod: null,
          orderId: order.id,
          snapToken: transaction.token,
          snapRedirectUrl: transaction.redirect_url,
        },
      });
    } else {
      const newInvoice = await prisma.payment.create({
        data: {
          amount: order.totalAmount + newDelivery.deliveryFee,
          invoiceNumber,
          paymentMethod: 'MANUAL_TRANSFER',
          orderId: order.id,
        },
      });
    }

    const newJournal = await Promise.all(
      order.OrderItems.map(async (val) => {
        await prisma.stockJournal.create({
          data: {
            quantity: val.qty,
            storeId,
            fromStoreId: storeId,
            productId: val.productId,
            status: 'AUTOMATED',
            type: 'PURCHASE',
            JournalDetail: { create: {} },
          },
        });
      }),
    );

    for (const orderItem of order.OrderItems) {
      // Find the storeProduct for the current productId and storeId
      const storeProduct = await prisma.storeProduct.findUnique({
        where: {
          storeId_productId: {
            storeId: order.storeId,
            productId: orderItem.productId,
          },
        },
      });

      if (!storeProduct) {
        throw new Error(
          `StoreProduct not found for storeId: ${order.storeId} and productId: ${orderItem.productId}`,
        );
      }

      // Update the storeProduct quantity
      const updatedStoreProduct = await prisma.storeProduct.update({
        where: { id: storeProduct.id },
        data: {
          qty: {
            decrement: orderItem.qty, // Decrease qty by orderItem.qty
          },
        },
      });
    }

    await prisma.cart.updateMany({
      where: { userId },
      data: { isActive: false, qty: 0 },
    });
    return { message: 'Order created successfully', order };
  } catch (error) {
    throw error;
  }
};
