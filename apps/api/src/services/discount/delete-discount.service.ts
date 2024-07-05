import prisma from '@/prisma';

interface userToken {
  id: number;
}
export const deleteDiscountService = async (id: number, user: userToken) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    const discount = await prisma.discount.update({
      where: { id },
      data: {
        isDelete: true,
        isActive: false,
      },
    });

    return { message: 'Discount Has been deleted', data: discount };
  } catch (error) {
    throw error;
  }
};
