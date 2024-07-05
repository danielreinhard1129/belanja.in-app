import prisma from '@/prisma';

export const getStockJournalByIdService = async (id: number) => {
  try {
    const stockJournal = await prisma.stockJournal.findFirst({
      where: { id },
      include: {
        store: true,
        product: true,
        JournalDetail: true,
      },
    });

    if (!stockJournal) {
      throw new Error('No journal found');
    }
    return stockJournal;
  } catch (error) {
    throw error;
  }
};
