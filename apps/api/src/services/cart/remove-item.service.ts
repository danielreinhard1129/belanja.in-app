import prisma from '@/prisma';


interface RemoveItemCartArgs {
  userId: number;
  cartId: number;
}

export const removeItemService = async (body: RemoveItemCartArgs) => {
  try {
    const { cartId, userId } = body;

    const findUser = await prisma.user.findFirst({ where: { id: userId } });
    if (!findUser) {
      throw new Error('User not found');
    }

    const findOrder = await prisma.cart.findFirst({ where: { id: cartId } });
    if (!findOrder) {
      throw new Error('Order not found');
    }

    const removeItem = await prisma.cart.update({
      where: {id:cartId, userId},
      data:{
        qty:0,
        isActive: false
      }
    })

    return {message: "decrement success"}
  } catch (error) {
    throw error;
  }
};
