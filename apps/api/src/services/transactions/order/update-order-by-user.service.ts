import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';

interface CancelUserOrderArgs {
  userId: number;
  orderId: number;
}
export const updateOrderByUserService = async (body: CancelUserOrderArgs) => {
  try {
    const { orderId, userId } = body;

    const findUser = await prisma.user.findFirst({ where: { id: userId } });
    if(!findUser){
      throw new Error("User not found")
    }

    const findOrder = await prisma.order.findFirst({where:{id:orderId}})
    if(!findOrder){
      throw new Error("Order not found")
    }

    const cancelOrder = await prisma.order.update({
      where:{id: orderId, userId},
      data: {status : OrderStatus.ORDER_CANCELLED}
    })
    
    return {message: "Order has been cancelled"}
  } catch (error) {
    throw error
  }
};
