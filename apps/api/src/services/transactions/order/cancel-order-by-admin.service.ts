import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';

interface CancelUserOrderArgs {
  orderId: number;
}
export const cancelOrderByAdminService = async (body: CancelUserOrderArgs) => {
  try {
    const { orderId } = body;


    const findOrder = await prisma.order.findFirst({where:{id:orderId}})
    if(!findOrder){
      throw new Error("Order not found")
    }

    const cancelOrder = await prisma.order.update({
      where:{id: orderId},
      data: {status : OrderStatus.ORDER_CANCELLED}
    })
    
    return {message: "Order has been cancelled"}
  } catch (error) {
    throw error
  }
};
