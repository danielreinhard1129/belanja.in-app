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

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

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
    let message = '';

    if (journal.type === 'MUTATION') {
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

      // Update status of stockJournal to 'ON_PROGRESS'
      updatedJournal = await prisma.stockJournal.update({
        where: {
          id: journal.id,
        },
        data: {
          status: 'ON_PROGRESS',
        },
      });

      message = 'Stock Mutation ON_PROGRESS';
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

      // Update status of stockJournal to 'ON_PROGRESS'
      updatedJournal = await prisma.stockJournal.update({
        where: {
          id: journal.id,
        },
        data: {
          status: 'ON_PROGRESS',
        },
      });

      message = 'Stock Increase Product ON_PROGRESS';
    } else if (journal.type === 'DECREASE') {
      // Handle decrease type
      const storeProduct = await prisma.storeProduct.findFirst({
        where: {
          storeId: journal.storeId,
          productId: journal.productId,
        },
      });

      if (!storeProduct) {
        throw new Error("Can't find storeProduct for decrease");
      }

      if (storeProduct.qty < journal.quantity) {
        throw new Error('Insufficient quantity in store');
      }

      // Calculate new quantity
      const newQty = storeProduct.qty - journal.quantity;

      // Update the quantity of the storeProduct
      await prisma.storeProduct.update({
        where: {
          id: storeProduct.id,
        },
        data: {
          qty: newQty,
        },
      });

      // Update status of stockJournal to 'ON_PROGRESS'
      updatedJournal = await prisma.stockJournal.update({
        where: {
          id: journal.id,
        },
        data: {
          status: 'ON_PROGRESS',
        },
      });

      message = 'Stock DECREASE Product ON_PROGRESS';
    }

    return {
      message,
      data: updatedJournal,
    };
  } catch (error) {
    throw error;
  }
};
