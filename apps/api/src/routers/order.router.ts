import { OrderController } from '@/controllers/order.controller';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/user', this.orderController.getOrdersByUserIdController);
 
  }

  getRouter(): Router {
    return this.router;
  }
}
