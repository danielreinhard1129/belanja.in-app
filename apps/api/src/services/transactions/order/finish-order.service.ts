import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';

interface FinishOrderArgs {
  userId: number;
  orderId: number;
}
export const finishOrderService = async (body: FinishOrderArgs) => {
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

    const finishOrder = await prisma.order.update({
      where:{id: orderId, userId},
      data: {status : OrderStatus.ORDER_RECEIVED}
    })
    
    return {message: "Order has been completed"}
  } catch (error) {
    throw error
  }
};
