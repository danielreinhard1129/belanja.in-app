import { midtransNotificationHandlerService } from '@/services/transactions/payment/midtrans-notification-handle.service';
import { Request, Response, NextFunction } from 'express';
export class PaymentController {
  async midtransNotificationHandlerController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await midtransNotificationHandlerService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
