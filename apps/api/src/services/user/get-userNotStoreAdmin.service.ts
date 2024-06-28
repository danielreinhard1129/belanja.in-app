import prisma from '@/prisma';

export const getUserNotStoreAdminService = async () => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
    });

    if (!users.length) {
      throw new Error('No user found');
    }

    return {
      data: users,
    };
  } catch (error) {
    throw error;
  }
};
