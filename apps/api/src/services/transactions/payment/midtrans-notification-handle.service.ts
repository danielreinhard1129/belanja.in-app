import prisma from '@/prisma';
import { PaymentResponse } from '@/types/midtrans-callback-response.type';

export const midtransNotificationHandlerService = async (
  body: PaymentResponse,
) => {
  try {
    if (!body) {
      throw new Error('midtrans callback failed');
    }

    const findOrder = await prisma.order.findFirst({
      where: { orderNumber: body.order_id },
      include: { Payment: true, OrderItems: true, Delivery: true },
    });


    if (!findOrder) {
      throw new Error('Order not found');
    }

    prisma.$transaction(async (tx) => {
      if (body.transaction_status == 'capture') {
        if (body.fraud_status == 'accept') {
          await tx.payment.update({
            where: { id: findOrder.Payment?.id },
            data: {
              paymentStatus: 'COMPLETED',
              paymentMethod:
                body.payment_type === 'qris'
                  ? 'QRIS'
                  : body.payment_type === 'bank_transfer'
                    ? 'VIRTUAL_ACCOUNT'
                    : null,
            },
          });
          if (findOrder.status == 'WAITING_FOR_PAYMENT') {
            await tx.order.update({
              where: { id: findOrder.id },
              data: { status: 'ORDER_PROCESSED' },
            });
          }
        }
      } else if (body.transaction_status == 'settlement') {
        await tx.payment.update({
          where: { id: findOrder.Payment?.id },
          data: {
            paymentStatus: 'COMPLETED',
            paymentMethod:
              body.payment_type === 'qris'
                ? 'QRIS'
                : body.payment_type === 'bank_transfer'
                  ? 'VIRTUAL_ACCOUNT'
                  : null,
          },
        });

        if (findOrder.status == 'WAITING_FOR_PAYMENT') {
          await tx.order.update({
            where: { id: findOrder.id },
            data: { status: 'ORDER_PROCESSED' },
          });
        }
      } else if (
        body.transaction_status === 'cancel' ||
        body.transaction_status === 'expired' ||
        body.transaction_status === 'deny'
      ) {
        await tx.payment.update({
          where: { id: findOrder.Payment?.id },
          data: {
            paymentStatus: 'CANCELLED',
            paymentMethod:
              body.payment_type === 'qris'
                ? 'QRIS'
                : body.payment_type === 'bank_transfer'
                  ? 'VIRTUAL_ACCOUNT'
                  : null,
          },
        });
        const refundJournal = await Promise.all(
          findOrder.OrderItems.map(async (val) => {
            await tx.stockJournal.create({
              data: {
                quantity: val.qty,
                storeId: findOrder.storeId,
                toStoreId: findOrder.storeId,
                productId: val.productId,
                status: 'AUTOMATED',
                type: 'REFUND',
                JournalDetail: { create: { toStoreId: findOrder.storeId } },
              },
            });
          }),
        );
        for (const orderItem of findOrder.OrderItems) {
          // Find the storeProduct for the current productId and storeId
          const storeProduct = await tx.storeProduct.findUnique({
            where: {
              storeId_productId: {
                storeId: findOrder.storeId,
                productId: orderItem.productId,
              },
            },
          });

          if (!storeProduct) {
            throw new Error(
              `StoreProduct not found for storeId: ${findOrder.storeId} and productId: ${orderItem.productId}`,
            );
          }

          // Update the storeProduct quantity
          const updatedStoreProduct = await tx.storeProduct.update({
            where: { id: storeProduct.id },
            data: {
              qty: {
                increment: orderItem.qty, // Decrease qty by orderItem.qty
              },
            },
          });
        }

        if (findOrder.status == 'WAITING_FOR_PAYMENT') {
          await tx.order.update({
            where: { id: findOrder.id },
            data: { status: 'ORDER_CANCELLED' },
          });
        }
        const findDelivery = await tx.delivery.findFirst({
          where: { id: findOrder.Delivery[0].id },
        });
        await tx.delivery.update({
          where: { id: findDelivery?.id },
          data: { status: 'CANCELLED' },
        });
      } else if (body.transaction_status == 'pending') {
        await tx.payment.update({
          where: { id: findOrder.Payment?.id },
          data: {
            paymentStatus: 'PENDING',
            paymentMethod:
              body.payment_type === 'qris'
                ? 'QRIS'
                : body.payment_type === 'bank_transfer'
                  ? 'VIRTUAL_ACCOUNT'
                  : null,
          },
        });
      }
    });

    return {
      message: 'OK',
    };
  } catch (error) {
    throw error;
  }
};
