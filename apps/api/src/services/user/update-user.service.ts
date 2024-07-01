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

    // Check if the requesting user exists and is a SUPERADMIN
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

    // Check if the target user to be updated exists
    const checkUserId = await prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserId) {
      throw new Error("Can't find this account");
    }

    // Check if the new email already exists in another user
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

    // Update the user
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
