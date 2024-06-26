import prisma from '@/prisma';

interface UserToken {
  id: number;
}

export const confirmStockProductMutationService = async (
  id: number,
  user: UserToken,
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

    const journal = await prisma.stockJournal.findFirst({
      where: { id },
      include: {
        JournalDetail: true,
      },
    });

    if (!journal) {
      throw new Error("Can't find Stock journal");
    }

    const fromStoreProduct = await prisma.storeProduct.findFirst({
      where: {
        storeId: journal.fromStoreId!,
        productId: journal.productId,
      },
    });

    const toStoreProduct = journal.toStoreId
      ? await prisma.storeProduct.findFirst({
          where: {
            storeId: journal.toStoreId!,
            productId: journal.productId,
          },
        })
      : null;

    let updatedJournal;
    if (journal.type === 'MUTATION_EXPORT') {
      if (!fromStoreProduct) {
        throw new Error("Can't find fromStoreProduct");
      }

      if (fromStoreProduct.qty < journal.quantity) {
        throw new Error('Insufficient quantity in fromStore');
      }

      // Reduce qty from fromStore
      await prisma.storeProduct.update({
        where: {
          id: fromStoreProduct.id,
        },
        data: {
          qty: {
            decrement: journal.quantity,
          },
        },
      });

      // Add qty to toStore
      if (toStoreProduct) {
        await prisma.storeProduct.update({
          where: {
            id: toStoreProduct.id,
          },
          data: {
            qty: {
              increment: journal.quantity,
            },
          },
        });
      } else {
        await prisma.storeProduct.create({
          data: {
            qty: journal.quantity,
            storeId: journal.toStoreId!,
            productId: journal.productId,
          },
        });
      }

      // Update status of stockJournal to 'SUCCESS'
      updatedJournal = await prisma.stockJournal.update({
        where: {
          id: journal.id,
        },
        data: {
          status: 'SUCCESS',
        },
      });

      // Optionally, update related JournalDetail records if needed
      await prisma.journalDetail.updateMany({
        where: {
          stockJournalId: journal.id,
        },
        data: {
          // Any specific updates needed for JournalDetail can be added here
        },
      });
    } else if (journal.type === 'MUTATION_IMPORT') {
      if (!toStoreProduct) {
        throw new Error("Can't find toStoreProduct");
      }

      if (toStoreProduct.qty < journal.quantity) {
        throw new Error('Insufficient quantity in toStore');
      }

      // Reduce qty from toStore
      await prisma.storeProduct.update({
        where: {
          id: toStoreProduct.id,
        },
        data: {
          qty: {
            decrement: journal.quantity,
          },
        },
      });

      // Add qty to fromStore
      if (fromStoreProduct) {
        await prisma.storeProduct.update({
          where: {
            id: fromStoreProduct.id,
          },
          data: {
            qty: {
              increment: journal.quantity,
            },
          },
        });
      } else {
        await prisma.storeProduct.create({
          data: {
            qty: journal.quantity,
            storeId: journal.fromStoreId!,
            productId: journal.productId,
          },
        });
      }

      // Update status of stockJournal to 'SUCCESS'
      updatedJournal = await prisma.stockJournal.update({
        where: {
          id: journal.id,
        },
        data: {
          status: 'SUCCESS',
        },
      });
    } else if (journal.type === 'INCREASE') {
      // Handle increase type
      const storeProduct = await prisma.storeProduct.findFirst({
        where: {
          storeId: journal.storeId,
          productId: journal.productId,
        },
      });

      if (storeProduct) {
        // Add qty to existing storeProduct
        await prisma.storeProduct.update({
          where: {
            id: storeProduct.id,
          },
          data: {
            qty: {
              increment: journal.quantity,
            },
          },
        });
      } else {
        // Create new storeProduct with the given qty
        await prisma.storeProduct.create({
          data: {
            qty: journal.quantity,
            storeId: journal.storeId!,
            productId: journal.productId,
          },
        });
      }

      // Update status of stockJournal to 'SUCCESS'
      updatedJournal = await prisma.stockJournal.update({
        where: {
          id: journal.id,
        },
        data: {
          status: 'SUCCESS',
        },
      });
    }

    return {
      message: 'Stock journal updated successfully',
      data: updatedJournal,
    };
  } catch (error) {
    throw error;
  }
};
