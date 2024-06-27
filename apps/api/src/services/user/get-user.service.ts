import prisma from '@/prisma';

export const getUserService = async (id: number) => {
  try {
    const users = await prisma.user.findMany({
      where: { id },
      include: {
        storeAdmin: {
          include: {
            user: true,
          },
        },
      },
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
