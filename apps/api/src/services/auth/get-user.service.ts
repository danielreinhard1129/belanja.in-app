import prisma from '@/prisma';

export const getUserService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error('user not found');
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};
