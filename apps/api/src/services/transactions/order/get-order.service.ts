import prisma from '@/prisma';
interface GetOrderQeuery {
  orderId: number;
  userId: number;
}

export const getOrderService = async (query: GetOrderQeuery) => {
  try {
    const { orderId, userId } = query;
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        OrderItems: {
          include: {
            products: { include: { images: true } },
          },
        },
        stores: { include: { City: true } },
        Payment: true,
        Delivery: {
          include: {
            addresses: {
              include: {
                cities: { include: { province: true } },
                subdistricts: true,
              },
            },
          },
        },
      },
    });
    return { data: order, message: 'Get order success' };
  } catch (error) {
    throw error;
  }
};
