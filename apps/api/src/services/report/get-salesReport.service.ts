import prisma from '@/prisma';

interface GetOrderQuery {
  storeId?: string;
  categoryId?: string;
  productId?: string;
  filterDate?: Date;
}

interface UserToken {
  id: number;
}

interface OrderItem {
  qty: number;
  total: number;
  // Jika ada properti lain yang dibutuhkan, tambahkan di sini
}

interface Order {
  OrderItems: OrderItem[];
}

export const getSalesReportService = async (
  query: GetOrderQuery,
  user: UserToken,
) => {
  try {
    const { filterDate, storeId, categoryId, productId } = query;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    let whereClause: any = {};

    if (filterDate !== undefined) {
      // Mengatur awal bulan (tanggal 1) dan akhir bulan (hari terakhir)
      const startOfMonth = new Date(
        filterDate.getFullYear(),
        filterDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        filterDate.getFullYear(),
        filterDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      whereClause.createdAt = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    if (checkUser.role === 'STOREADMIN') {
      const getStoreAdmin = await prisma.storeAdmin.findFirst({
        where: { userId: checkUser.id },
      });

      if (!getStoreAdmin) throw new Error('You are not a store admin');

      const checkUserStore = await prisma.store.findFirst({
        where: {
          storeAdminId: getStoreAdmin.id,
        },
      });

      if (!checkUserStore) throw new Error('You do not have any store');

      whereClause.storeId = checkUserStore.id;
    } else if (checkUser.role === 'SUPERADMIN' && storeId) {
      whereClause.storeId = Number(storeId);
    }

    if (categoryId) {
      whereClause.OrderItems = {
        some: {
          products: {
            categories: {
              some: {
                categoryId: Number(categoryId),
              },
            },
          },
        },
      };
    }

    if (productId) {
      if (!whereClause.OrderItems) {
        whereClause.OrderItems = {
          some: {},
        };
      }
      whereClause.OrderItems.some.productId = Number(productId);
    }

    const calculateTotalAmount = (orders: Order[]): number => {
      return orders.reduce((total: number, order: Order) => {
        const orderTotal = order.OrderItems.reduce(
          (itemTotal: number, item: OrderItem) => {
            return itemTotal + item.total;
          },
          0,
        );
        return total + orderTotal;
      }, 0);
    };

    const salesReport = await prisma.order.findMany({
      where: whereClause,
      include: {
        OrderItems: true,
      },
    });

    const salesReportByCategory = await prisma.order.findMany({
      where: whereClause,
      include: {
        OrderItems: {
          include: {
            products: {
              include: {
                categories: true,
              },
            },
          },
        },
      },
    });

    const salesReportByProduct = await prisma.order.findMany({
      where: whereClause,
      include: {
        OrderItems: {
          include: {
            products: true,
          },
        },
      },
    });

    const totalAmountSalesReport = calculateTotalAmount(salesReport);
    const totalAmountSalesReportByCategory = calculateTotalAmount(
      salesReportByCategory,
    );
    const totalAmountSalesReportByProduct =
      calculateTotalAmount(salesReportByProduct);

    return {
      salesReport,
      salesReportByCategory,
      salesReportByProduct,
      totalAmountSalesReport,
      totalAmountSalesReportByCategory,
      totalAmountSalesReportByProduct,
    };
  } catch (error) {
    throw error;
  }
};
