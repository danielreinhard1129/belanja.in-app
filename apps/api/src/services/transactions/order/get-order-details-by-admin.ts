import prisma from '@/prisma';
interface GetOrderQeuery {
  orderId: number;

  
}

export const getOrderDetailsByAdminService = async (query: GetOrderQeuery) => {
  try {
    const { orderId } = query;
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        OrderItems: {
          include: {
            products: { include: { images: true } },
          },
        },
        stores: { include: { City: true } },
        Payment: true,
      },
    });
    if(!order){
        throw new Error("Order not found")
    }
    return { data: order, message: 'Get order successsssssss' };
  } catch (error) {
    throw error;
  }
};
