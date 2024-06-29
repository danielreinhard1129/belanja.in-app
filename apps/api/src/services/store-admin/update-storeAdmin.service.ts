import prisma from '@/prisma';
import { User } from '@prisma/client';

interface UserToken {
  id: number;
}

export const updateStoreAdminService = async (
  id: number,
  body: Pick<User, 'name' | 'email'> & { nip: number },
  user: UserToken,
) => {
  try {
    const { name, email, nip } = body;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    const checkUserId = await prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserId) {
      throw new Error("Can't find this account");
    }

    if (nip) {
      const existingNip = await prisma.storeAdmin.findFirst({
        where: {
          nip,
          NOT: {
            id,
          },
        },
      });

      if (existingNip) {
        throw new Error('Nip already in use');
      }
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

    const result = await prisma.$transaction(async (prisma) => {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          name,
          email,
        },
      });

      const updatedStoreAdmin = await prisma.storeAdmin.update({
        where: { userId: id },
        data: {
          nip,
        },
      });

      return {
        ...updatedUser,
        storeAdmin: updatedStoreAdmin,
      };
    });

    return result;
  } catch (error) {
    throw error;
  }
};
