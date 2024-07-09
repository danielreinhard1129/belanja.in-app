import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { transporter } from '@/libs/nodemailer';

interface ConfirmPaymentArgs {
  orderId: number;
}
export const confirmPaymentService = async (body: ConfirmPaymentArgs) => {
  try {
    const { orderId } = body;

    const findOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: { users: true },
    });
    if (!findOrder) {
      throw new Error('Order not found');
    }

    const confirmPayment = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.ORDER_PROCESSED },include:{users:true}
    });

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/orderUpdate.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({
      name: confirmPayment?.users.name,
      orderStatus: confirmPayment?.status,
    });

    await transporter.sendMail({
      from: 'Admin',
      to: confirmPayment?.users.email,
      subject: 'Your order at Belanjain.com',
      html: htmlToSend,
    });

    return { message: 'Payment has been confirmed' };
  } catch (error) {
    throw error;
  }
};
