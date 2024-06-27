import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const getStockJournalsSuperAdminNotificationsService = async (
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

    const stockJournals = await prisma.stockJournal.findMany({
      where: {
        isRead: false,
      },
      select: {
        type: true,
        store: {
          select: {
            name: true,
          },
        },
        JournalDetail: {
          select: {
            toStore: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const notifications = stockJournals.map((journal) => ({
      count: stockJournals.length,
      type: journal.type,
      store: journal.store,
      JournalDetail: journal.JournalDetail.map((detail) => ({
        toStore: detail.toStore,
      })),
    }));

    return notifications;
  } catch (error) {
    throw error;
  }
};
