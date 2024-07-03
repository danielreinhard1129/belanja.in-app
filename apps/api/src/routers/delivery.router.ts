import { CartController } from '@/controllers/cart.controller';
import { DeliveryController } from '@/controllers/delivery.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class DeliveryRouter {
  private router: Router;
  private deliveryController: DeliveryController;

  constructor() {
    this.deliveryController = new DeliveryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/fee',
      verifyToken,
      this.deliveryController.getDeliveryFeeController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
