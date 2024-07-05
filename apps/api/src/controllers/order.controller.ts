import { cancelOrderByAdminService } from '@/services/transactions/order/cancel-order-by-admin.service';
import { confirmPaymentService } from '@/services/transactions/order/confirm-payment.service';
import { createOrderService } from '@/services/transactions/order/create-order.service';
import { finishOrderService } from '@/services/transactions/order/finish-order.service';
import { getAllOrdersService } from '@/services/transactions/order/get-all-orders.service';
import { getOrderDetailsByAdminService } from '@/services/transactions/order/get-order-details-by-admin';
import { getOrderService } from '@/services/transactions/order/get-order.service';
import { getOrdersByUserId } from '@/services/transactions/order/get-orders-byUserId.service';
import { sendOrderByAdminService } from '@/services/transactions/order/send-order-by-admin.service';
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
        fromDate: (req.query.fromDate as string) || '',
        toDate: (req.query.toDate as string) || '',
      };
      const result = await getOrdersByUserId(query);
      console.log("ini dari order BE",result);
      

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getAllOrdersController(
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
        fromDate: (req.query.fromDate as string) || '',
        toDate: (req.query.toDate as string) || '',
        storeId: (req.query.storeId as string) || ' ',
      };
      const result = await getAllOrdersService(query);

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
  async getOrderDetailsByAdminController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        orderId: parseInt(req.query.orderId as string),
      };
      const result = await getOrderDetailsByAdminService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async cancelOrderByAdminController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orderId = req.body.orderId;

      const result = await cancelOrderByAdminService({ orderId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async sendOrderByAdminController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orderId = req.body.orderId;

      const result = await sendOrderByAdminService({ orderId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async confirmPaymentController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const orderId = req.body.orderId;

      const result = await confirmPaymentService({ orderId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
