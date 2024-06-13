import { hashPassword } from '@/libs/bcrypt';
import prisma from '@/prisma';

export const changePasswordService = async (
  userId: number,
  password: string,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Account not found');
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return {
      message: 'Change password success',
    };
  } catch (error) {
    throw error;
  }
};
