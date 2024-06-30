import { OrderController } from '@/controllers/order.controller';
import { verifyToken } from '@/middlewares/verifyToken';
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
    this.router.get('/user',verifyToken, this.orderController.getOrdersByUserIdController);
    this.router.post(
      '/user/new-order',
      this.orderController.createOrderController,
    );
    this.router.patch('/user/cancel-order',verifyToken, this.orderController.cancelOrderByUserController);
    this.router.patch('/user/finish-order',verifyToken, this.orderController.finishOrderByUserController);

  }

  getRouter(): Router {
    return this.router;
  }
}
