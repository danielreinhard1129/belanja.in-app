import { hashPassword } from '@/libs/bcrypt';
import prisma from '@/prisma';

interface userToken {
  id: number;
}
export const updateResetPasswordStoreAdminService = async (
  id: number,
  user: userToken,
) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    const checkUserExist = await prisma.user.findUnique({
      where: { id },
    });

    if (!checkUserExist) {
      throw new Error("Can't find this account");
    }

    const users = await prisma.user.update({
      where: { id },
      data: {
        password: await hashPassword('Admin123'),
      },
    });

    return { message: 'Store Admin Has been password reseted', data: users };
  } catch (error) {
    throw error;
  }
};
