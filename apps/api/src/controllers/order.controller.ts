import { createOrderService } from '@/services/transactions/order/create-order.service';
import { finishOrderService } from '@/services/transactions/order/finish-order.service';
import { getOrderService } from '@/services/transactions/order/get-order.service';
import { getOrderReportService } from '@/services/transactions/order/get-orderReports.service';
import { getOrdersByUserId } from '@/services/transactions/order/get-orders-byUserId.service';
import { updateOrderByUserService } from '@/services/transactions/order/update-order-by-user.service';
import { OrderStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export class OrderController {
  async getOrdersByUserIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        id: parseInt(res.locals.user.id),
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'updatedAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        status: req.query.status as OrderStatus,
        category: (req.query.category as string) || '',
      };
      const result = await getOrdersByUserId(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async createOrderController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createOrderService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelOrderByUserController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orderId = req.body.orderId;
      const userId = Number(res.locals.user.id);

      const result = await updateOrderByUserService({ orderId, userId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async finishOrderByUserController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orderId = req.body.orderId;
      const userId = Number(res.locals.user.id);

      const result = await finishOrderService({ orderId, userId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getOrderController(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        userId: parseInt(res.locals.user.id),
        orderId: parseInt(req.query.orderId as string),
      };
      const result = await getOrderService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrderReportController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const currentDate = new Date();
      const query = {
        year: parseInt(req.params.year as string) || currentDate.getFullYear(),
        month:
          parseInt(req.params.month as string) || currentDate.getMonth() + 1, // Bulan dimulai dari 0
        day: parseInt(req.params.day as string) || currentDate.getDate(),
      };
      const result = await getOrderReportService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
