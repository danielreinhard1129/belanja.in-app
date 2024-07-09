import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';
import { scheduleJob } from 'node-schedule';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { transporter } from '@/libs/nodemailer';

interface SendUserOrderArgs {
  orderId: number;
}
export const sendOrderByAdminService = async (body: SendUserOrderArgs) => {
  try {
    const { orderId } = body;

    const findOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: { Delivery: true, users: true },
    });
    if (!findOrder) {
      throw new Error('Order not found');
    }

    const findDelivery = await prisma.delivery.findFirst({
      where: { id: findOrder.Delivery[0].id },
    });

    if (!findDelivery) {
      throw new Error('Deliver not found');
    }

    const sendOrder = await prisma.$transaction(async (tx) => {
      const updateOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.ORDER_SHIPPED },
        include: { users: true },
      });

      const startDelivery = await tx.delivery.update({
        where: { id: findDelivery.id },
        data: { status: 'ON_DELIVERY' },
      });

      const emailTemplatePath = path.join(
        __dirname,
        '../../../templates/orderUpdate.hbs',
      );

      const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

      const template = Handlebars.compile(emailTemplateSource);
      const htmlToSend = template({
        name: updateOrder?.users.name,
        orderStatus: updateOrder?.status,
      });

      await transporter.sendMail({
        from: 'Admin',
        to: updateOrder?.users.email,
        subject: 'Your order at Belanjain.com',
        html: htmlToSend,
      });
      return { startDelivery, updateOrder };
    });

    const scheduleDeliver = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    scheduleJob('run every', scheduleDeliver, async () => {
      const findDelivery = await prisma.delivery.findFirst({
        where: { id: sendOrder.startDelivery.id },
      });
      if (findDelivery?.status === 'ON_DELIVERY') {
        const autoDeliver = await prisma.$transaction(async (tx) => {
          return await tx.delivery.update({
            where: { id: sendOrder.startDelivery.id },
            data: { status: 'DELIVERED' },
          });
        });
      }
      
    });

    const scheduleReceive = new Date(
      scheduleDeliver.getTime() + 2 * 24 * 3600 * 1000,
    );
    scheduleJob('run every', scheduleReceive, async () => {
      const findDelivery = await prisma.delivery.findFirst({
        where: { id: sendOrder.startDelivery.id },
      });
      const findOrder = await prisma.order.findFirst({
        where: { id: sendOrder.updateOrder.id },
        include: { users: true },
      });
      if (
        findOrder?.status === 'ORDER_SHIPPED' &&
        findDelivery?.status === 'DELIVERED'
      ) {
        await prisma.order.update({
          where: { id: sendOrder.updateOrder.id },
          data: { status: 'ORDER_RECEIVED' },
        });
      }
      const emailTemplatePath = path.join(
        __dirname,
        '../../../templates/orderUpdate.hbs',
      );

      const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

      const template = Handlebars.compile(emailTemplateSource);
      const htmlToSend = template({
        name: findOrder?.users.name,
        orderStatus: findOrder?.status,
      });

      await transporter.sendMail({
        from: 'Admin',
        to: findOrder?.users.email,
        subject: 'Your order at Belanjain.com',
        html: htmlToSend,
      });
    });

    return { message: 'Order has been shipped' };
  } catch (error) {
    throw error;
  }
};
