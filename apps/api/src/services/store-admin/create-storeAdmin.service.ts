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

  // Cek apakah user yang melakukan aksi adalah SUPERADMIN
  const checkUser = await prisma.user.findUnique({
    where: {
      id: Number(user.id),
    },
  });

  if (!checkUser || checkUser.role !== 'SUPERADMIN') {
    throw new Error('Unauthorized access');
  }

  // Cek apakah email sudah ada dalam database
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
    // Jika user dengan email tersebut sudah ada
    if (existingUser.isDelete && existingUser.role === 'STOREADMIN') {
      // Update user yang isDelete true dengan data baru
      existingUser = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name,
          password: await hashPassword('Admin123'), // Ganti password jika diperlukan
          isDelete: false,
          isVerified: true, // Misalnya, aktifkan ulang jika perlu
        },
      });

      // update storeAdmin  untuk user yang diaktifkan kembali
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

  // Jika tidak ada user dengan email tersebut, buat user baru dan storeAdmin
  const hashedPassword = await hashPassword('Admin123'); // Ganti password jika perlu

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
