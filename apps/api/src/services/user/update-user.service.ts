import prisma from '@/prisma';
import { User } from '@prisma/client';

interface UserToken {
  id: number;
}

export const updateUserService = async (
  id: number,
  body: Pick<User, 'name' | 'email'>,
  user: UserToken,
) => {
  try {
    const { name, email } = body;
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') {
      throw new Error('Unauthorized access');
    }
    const checkUserId = await prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserId) {
      throw new Error("Can't find this account");
    }
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id,
          },
        },
      });
      if (existingEmail) {
        throw new Error('Email already exists');
      }
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
      },
    });

    return updatedUser;
  } catch (error) {
    throw error;
  }
};
