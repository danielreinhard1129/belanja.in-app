import { hashPassword } from '@/libs/bcrypt';
import prisma from '@/prisma';
import { User } from '@prisma/client';

interface CreateStoreAdmin extends Omit<User, 'id'> {
  nip: number;
}

interface UserToken {
  id: number;
}

export const createStoreAdminService = async (
  body: CreateStoreAdmin,
  user: UserToken,
) => {
  const { nip, name, email } = body;
  const checkUser = await prisma.user.findUnique({
    where: {
      id: Number(user.id),
    },
  });

  if (!checkUser) {
    throw new Error("Can't find your account");
  }

  if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

  const checkNip = await prisma.storeAdmin.findFirst({
    where: {
      nip: nip,
    },
  });

  if (checkNip) {
    throw new Error('This NIP already exists');
  }

  const checkEmail = await prisma.user.findFirst({
    where: { email },
  });

  if (checkEmail) {
    throw new Error('Email already exists');
  }

  try {
    const password = 'Admin123';
    const hashedPassword = await hashPassword(password);

    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isVerified: true,
        },
      });

      const createStoreAdmin = await prisma.storeAdmin.create({
        data: {
          nip: Number(nip),
          userId: newUser.id,
        },
      });

      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          role: 'STOREADMIN',
        },
      });

      return createStoreAdmin;
    });

    return {
      message: 'Store Admin has been created',
      data: result,
    };
  } catch (error) {
    throw error;
  }
};
