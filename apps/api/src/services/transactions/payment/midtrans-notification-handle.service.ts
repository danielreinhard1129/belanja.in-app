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
      include: { Payment: true, OrderItems: true },
    });

    console.log("ini dari midtrans", body);
    
    if (!findOrder) {
      throw new Error('Order not found');
    }



    if (body.transaction_status == 'capture') {
      if (body.fraud_status == 'accept') {
        await prisma.payment.update({
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
          await prisma.order.update({
            where: { id: findOrder.id },
            data: { status: 'ORDER_PROCESSED' },
          });
        }
      }
    } else if (body.transaction_status == 'settlement') {
      await prisma.payment.update({
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
        await prisma.order.update({
          where: { id: findOrder.id },
          data: { status: 'ORDER_PROCESSED' },
        });
      }
    } else if (
      body.transaction_status === 'cancel' ||
      body.transaction_status === 'expired' ||
      body.transaction_status === 'deny'
    ) {
      await prisma.payment.update({
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
          await prisma.stockJournal.create({
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
        const storeProduct = await prisma.storeProduct.findUnique({
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
        const updatedStoreProduct = await prisma.storeProduct.update({
          where: { id: storeProduct.id },
          data: {
            qty: {
              increment: orderItem.qty, // Decrease qty by orderItem.qty
            },
          },
        });
      }

      if (findOrder.status == 'WAITING_FOR_PAYMENT') {
        await prisma.order.update({
          where: { id: findOrder.id },
          data: { status: 'ORDER_CANCELLED' },
        });
      }
      // } else if (body.transaction_status == 'deny') {

      // } else if (transaction_status == 'expire') {
      //   await prisma.payment.update({
      //     where: { id: existingInvoice.id },
      //     data: { paymentStatus: 'EXPIRED', paymentMethode: payment_type },
      //   });
    } else if (body.transaction_status == 'pending') {
      await prisma.payment.update({
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

    return {
      message: 'OK',
    };
  } catch (error) {
    throw error;
  }
};
