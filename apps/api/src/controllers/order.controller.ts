import { createOrderService } from '@/services/transactions/order/create-order.service';
import { getOrdersByUserId } from '@/services/transactions/order/get-orders-byUserId.service';
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
        id: parseInt(req.query.id as string),
        take: parseInt(req.query.take as string) || 10,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'updatedAt',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        status: req.query.status as OrderStatus,
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
}
