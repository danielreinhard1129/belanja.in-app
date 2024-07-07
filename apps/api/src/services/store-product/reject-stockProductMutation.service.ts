import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const rejectStockProductMutationService = async (
  id: number,
  user: UserToken,
) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: { id: Number(user.id) },
    });
    if (!checkUser) {
      throw new Error("Can't find your account");
    }
    if (checkUser.role === 'USER') {
      throw new Error('Unauthorized access');
    }
    const journal = await prisma.stockJournal.findFirst({
      where: { id },
      include: { JournalDetail: true },
    });
    if (!journal) {
      throw new Error("Can't find Stock journal");
    }
    const updatedJournal = await prisma.stockJournal.update({
      where: { id: journal.id },
      data: {
        status: 'REJECT',
      },
    });
    return {
      message: 'Stock mutation rejected',
      data: updatedJournal,
    };
  } catch (error) {
    throw error;
  }
};
