import { CartController } from '@/controllers/cart.controller';
import { PaymentController } from '@/controllers/payment.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/midtrans/',
      this.paymentController.midtransNotificationHandlerController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
