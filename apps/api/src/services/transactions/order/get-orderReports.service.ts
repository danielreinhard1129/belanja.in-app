import prisma from '@/prisma';

interface GetOrderQuery {
  year: number;
}

export const getOrderReportService = async (query: GetOrderQuery) => {
  try {
    const { year } = query;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          { createdAt: { gte: startDate } },
          { createdAt: { lt: endDate } },
          { status: 'ORDER_RECEIVED' },
        ],
      },
      include: {
        OrderItems: {
          include: {
            products: true,
          },
        },
        stores: { include: { City: true } },
      },
    });

    if (orders.length === 0) {
      throw new Error(`No orders found for the year ${year}`);
    }

    const totalSales = orders.reduce(
      (total, order) => total + order.totalAmount,
      0,
    );

    return { data: orders, totalSales, message: 'Get order report success' };
  } catch (error) {
    throw error;
  }
};
