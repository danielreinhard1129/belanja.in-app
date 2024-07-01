import prisma from '@/prisma';

export const getUserWithSuperAdminService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        storeAdmin: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('No user found');
    }
    return user;
  } catch (error) {
    throw error;
  }
};
