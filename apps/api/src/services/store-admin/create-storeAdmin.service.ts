import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { StoreAdmin } from '@prisma/client';

interface CreateStoreAdmin extends Omit<StoreAdmin, 'id'> {}

interface UserToken {
  id: number;
}

export const createStoreAdminService = async (
  body: CreateStoreAdmin,
  user: UserToken,
) => {
  try {
    const { nip, userId } = body;

    // Cari user berdasarkan user.id
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    const userIdData = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!userIdData) {
      throw new Error("Can't find this user");
    }

    // const checkNip = await prisma.storeAdmin.findUnique({
    //   where: {
    //     nip: Number(nip),
    //   },
    // });

    // if (checkNip) {
    //   throw new Error('This NIP already exists for another user');
    // }

    const createStoreAdmin = await prisma.storeAdmin.create({
      data: {
        nip: Number(nip),
        userId: Number(userId),
      },
    });

    const link = `${NEXT_BASE_URL}/login`;

    await transporter.sendMail({
      from: 'Admin',
      to: userIdData.email,
      subject: 'Now you are a store admin',
      html: `<a href="${link}" target="_blank">Login</a>`,
    });

    return {
      message: 'Store Admin has been created',
      data: createStoreAdmin,
    };
  } catch (error) {
    throw error;
  }
};
