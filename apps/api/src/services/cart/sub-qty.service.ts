import prisma from '@/prisma';


interface AddQtyArgs {
  userId: number;
  cartId: number;
}

export const subQtyService = async (body: AddQtyArgs) => {
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

    const decrementQty = await prisma.cart.update({
      where: {id:cartId, userId},
      data:{
        qty:{decrement: 1}
      }
    })

    return {message: "decrement success"}
  } catch (error) {
    throw error;
  }
};
