import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';

interface SendUserOrderArgs {
  orderId: number;
}
export const sendOrderByAdminService = async (body: SendUserOrderArgs) => {
  try {
    const { orderId } = body;

    const findOrder = await prisma.order.findFirst({
      where: { id: orderId },
      include: { Delivery: true },
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

    const sendOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.ORDER_SHIPPED },
    });

    const startDelivery = await prisma.delivery.update({
      where: { id: findDelivery.id },
      data: { status: 'ON_DELIVERY' },
    });

    return { message: 'Order has been shipped' };
  } catch (error) {
    throw error;
  }
};
