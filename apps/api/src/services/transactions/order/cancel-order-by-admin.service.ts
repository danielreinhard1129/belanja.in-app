import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { transporter } from '@/libs/nodemailer';

interface CancelUserOrderArgs {
  orderId: number;
}
export const cancelOrderByAdminService = async (body: CancelUserOrderArgs) => {
  try {
    const { orderId } = body;

    const findOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: { OrderItems: true, Payment: true, Delivery: true, users: true },
    });
    if (!findOrder) {
      throw new Error('Order not found');
    }
    const cancel = await prisma.$transaction(async (tx) => {
      const cancelOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.ORDER_CANCELLED },
        include: { users: true },
      });
      {
        await tx.payment.update({
          where: { id: findOrder.Payment?.id },
          data: {
            paymentStatus: 'CANCELLED',
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
        return cancelOrder;
      }
    });
    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/orderUpdate.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({
      name: cancel.users.name,
      orderStatus: cancel?.status,
    });

    await transporter.sendMail({
      from: 'Admin',
      to: cancel?.users.email,
      subject: 'Your order at Belanjain.com',
      html: htmlToSend,
    });

    return { message: 'Order has been cancelled' };
  } catch (error) {
    throw error;
  }
};
