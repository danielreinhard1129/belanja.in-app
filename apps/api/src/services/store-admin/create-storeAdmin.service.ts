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

  if (!checkUser || checkUser.role !== 'SUPERADMIN') {
    throw new Error('Unauthorized access');
  }

  let existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (nip) {
    const existingNip = await prisma.storeAdmin.findFirst({
      where: {
        nip,
      },
    });

    if (existingNip) {
      throw new Error('Nip already in use');
    }
  }

  if (existingUser) {
    if (existingUser.isDelete && existingUser.role === 'STOREADMIN') {
      existingUser = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name,
          password: await hashPassword('Admin123!'),
          isDelete: false,
          isVerified: true,
        },
      });

      const createStoreAdmin = await prisma.storeAdmin.update({
        where: { userId: existingUser.id },
        data: {
          nip: Number(nip),
        },
      });

      return {
        message: 'Store Admin has been created for reactivated user',
        data: createStoreAdmin,
      };
    } else {
      throw new Error('Email already exists');
    }
  }

  const hashedPassword = await hashPassword('Admin123');

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
};
