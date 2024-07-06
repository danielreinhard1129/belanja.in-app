import { midtransNotificationHandlerService } from '@/services/transactions/payment/midtrans-notification-handle.service';
import { uploadPaymentProofService } from '@/services/transactions/payment/upload-payment-proof.service';
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

  async uploadPaymentProofController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = Number(res.locals.user.id);
      const orderId = Number(req.body.orderId);
      console.log("orderId",req.body.id);
      
      const result = await uploadPaymentProofService(userId, orderId, files[0]);

      return res.status(200).send(result);
    } catch (error) {
        next(error)
    }
  }
}
