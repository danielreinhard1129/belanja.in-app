import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { transporter } from '@/libs/nodemailer';
interface FinishOrderArgs {
  userId: number;
  orderId: number;
}
export const finishOrderService = async (body: FinishOrderArgs) => {
  try {
    const { orderId, userId } = body;

    const findUser = await prisma.user.findFirst({ where: { id: userId } });
    if (!findUser) {
      throw new Error('User not found');
    }

    const findOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: { users: true },
    });
    if (!findOrder) {
      throw new Error('Order not found');
    }

    const finishOrder = await prisma.order.update({
      where: { id: orderId, userId },
      data: { status: OrderStatus.ORDER_RECEIVED },include:{users:true}
    });

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/orderUpdate.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({
      name: finishOrder?.users.name,
      orderStatus: findOrder?.status,
    });

    await transporter.sendMail({
      from: 'Admin',
      to: finishOrder?.users.email,
      subject: 'Your order at Belanjain.com',
      html: htmlToSend,
    });
    return { message: 'Order has been completed' };
  } catch (error) {
    throw error;
  }
};
