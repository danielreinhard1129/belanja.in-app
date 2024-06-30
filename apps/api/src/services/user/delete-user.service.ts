import prisma from '@/prisma';

interface userToken {
  id: number;
}
export const deleteUserService = async (id: number, user: userToken) => {
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

    const users = await prisma.user.update({
      where: { id },
      data: {
        isDelete: true,
        isVerified: false,
      },
    });

    return { message: 'User Has been deleted', data: users };
  } catch (error) {
    throw error;
  }
};
