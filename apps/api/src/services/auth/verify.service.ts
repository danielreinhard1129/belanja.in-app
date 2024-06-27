import { hashPassword } from '@/libs/bcrypt';
import prisma from '@/prisma';

export const verifyService = async (userId: number, password: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof password !== 'string') {
      throw new Error('password must be string')
    }

    const hashedPassword = await hashPassword(password);

    const verifyUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isVerified: true,
      },
    });

    return {
      message: 'Thanks, your email has been verified',
      data: verifyUser,
    };
  } catch (error) {
    throw error;
  }
};
