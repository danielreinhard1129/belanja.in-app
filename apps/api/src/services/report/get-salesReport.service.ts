import prisma from '@/prisma';
import { endOfMonth, getDaysInMonth } from 'date-fns';

interface GetOrderQuery {
  storeId?: string;
  filterMonth: string;
  filterYear: string;
}

interface UserToken {
  id: number;
}

export const getSalesReportService = async (
  query: GetOrderQuery,
  user: UserToken,
) => {
  try {
    const { filterMonth, filterYear, storeId } = query;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    let whereClause: any = {
      status: 'ORDER_RECEIVED',
    };

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

    const now = new Date();
    const month = filterMonth ? Number(filterMonth) - 1 : now.getMonth();
    const year = filterYear ? Number(filterYear) : now.getFullYear();

    function getDaysInSpecificMonth(year: number, month: number): number {
      const date = new Date(year, month);
      return getDaysInMonth(date);
    }
    const daysInMonth = getDaysInSpecificMonth(year, month);

    const incomeDaily: number[] = [];
    const transactionDaily: number[] = [];

    const fetchDailyData = async () => {
      for (let i = 1; i <= daysInMonth; i++) {
        const day = new Date(year, month, i);
        const startOfDay = new Date(day.setHours(0, 0, 0, 0));
        const endOfDay = new Date(day.setHours(23, 59, 59, 999));

        const dailyWhereClause = {
          ...whereClause,
          updatedAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        };

        const dailyOrders = await prisma.order.findMany({
          where: dailyWhereClause,
          include: {
            OrderItems: true,
          },
        });

        let totalIncome = 0;
        let totalTransaction = 0;

        dailyOrders.forEach((order) => {
          totalIncome += order.totalAmount;
          totalTransaction += 1;
        });
        incomeDaily.push(Number(totalIncome));
        transactionDaily.push(Number(totalTransaction));
      }
    };

    await fetchDailyData();

    const incomeMonthly: number[] = [];
    const transactionMonthly: number[] = [];
    const monthTypes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const fetchMonthlyData = async () => {
      for (const monthType of monthTypes) {
        const startDate = new Date(year, monthType - 1, 1);
        const endDate = endOfMonth(startDate);

        const monthlyWhereClause = {
          ...whereClause,
          updatedAt: {
            gte: startDate,
            lt: endDate,
          },
        };

        const monthlyOrders = await prisma.order.findMany({
          where: monthlyWhereClause,
          include: {
            OrderItems: true,
          },
        });

        let totalIncome = 0;
        let totalTransaction = 0;

        monthlyOrders.forEach((order) => {
          totalIncome += order.totalAmount;
          totalTransaction += 1;
        });

        incomeMonthly.push(Number(totalIncome));
        transactionMonthly.push(Number(totalTransaction));
      }
    };

    await fetchMonthlyData();

    const startDate = new Date(year, month, 1);
    const endDate = endOfMonth(startDate);

    whereClause.updatedAt = {
      gte: startDate,
      lt: endDate,
    };

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        OrderItems: true,
      },
    });

    let totalIncome = 0;
    let totalTransaction = 0;

    orders.forEach((order) => {
      totalIncome += order.totalAmount;
      totalTransaction += 1;
    });

    return {
      data: {
        totalIncome: totalIncome,
        totalTransaction: totalTransaction,
        incomeMonthly: incomeMonthly,
        transactionMonthly: transactionMonthly,
        incomeDaily: incomeDaily,
        transactionDaily: transactionDaily,
      },
    };
  } catch (error) {
    throw error;
  }
};
