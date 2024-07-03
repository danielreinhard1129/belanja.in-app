import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';

interface SendUserOrderArgs {
  orderId: number;
}
export const sendOrderByAdminService = async (body: SendUserOrderArgs) => {
  try {
    const { orderId } = body;


    const findOrder = await prisma.order.findFirst({where:{id:orderId}})
    if(!findOrder){
      throw new Error("Order not found")
    }

    const sendOrder = await prisma.order.update({
      where:{id: orderId},
      data: {status : OrderStatus.ORDER_SHIPPED}
    })
    
    return {message: "Order has been shipped"}
  } catch (error) {
    throw error
  }
};
