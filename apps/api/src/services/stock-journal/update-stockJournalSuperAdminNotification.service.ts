import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const updateStockJournalsSuperAdminNotificationsService = async (
  userToken: UserToken,
) => {
  try {
    const userId = Number(userToken.id);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        storeAdmin: {
          include: {
            stores: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("Can't find your account");
    }

    if (user.role !== 'SUPERADMIN') {
      throw new Error(`You do not have access`);
    }

    const stockJournals = await prisma.stockJournal.updateMany({
      where: {
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return stockJournals;
  } catch (error) {
    throw error;
  }
};
