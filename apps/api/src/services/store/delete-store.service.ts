import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const deleteStoreService = async (storeId: number, user: UserToken) => {
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

    const store = await prisma.store.findFirst({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error('invalid store id');
    }

    await prisma.store.delete({
      where: { id: storeId },
    });
  } catch (error) {
    throw error;
  }
};
