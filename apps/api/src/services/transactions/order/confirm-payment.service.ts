import prisma from '@/prisma';
import { OrderStatus } from '@prisma/client';

interface ConfirmPaymentArgs {
  orderId: number;
}
export const confirmPaymentService = async (body: ConfirmPaymentArgs) => {
  try {
    const { orderId } = body;


    const findOrder = await prisma.order.findFirst({where:{id:orderId}})
    if(!findOrder){
      throw new Error("Order not found")
    }

    const confirmPayment = await prisma.order.update({
      where:{id: orderId},
      data: {status : OrderStatus.ORDER_PROCESSED}
    })
    
    return {message: "Payment has been confirmed"}
  } catch (error) {
    throw error
  }
};
