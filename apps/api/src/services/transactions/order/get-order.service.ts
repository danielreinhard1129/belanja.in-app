import prisma from '@/prisma';
interface GetOrderQeuery {
  orderId: number;
}

export const getOrderService = async (query: GetOrderQeuery) => {
  try {
    const { orderId } = query;
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        OrderItems: {
          include: {
            products: { include: { images: true } },
          },
        }, stores: true
      },
    });
    return { data: order, message: 'Get order success' };
  } catch (error) {
    throw error;
  }
};
