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
    this.router.get('/admin',verifyToken, this.orderController.getAllOrdersController);
    this.router.post(
      '/user/new-order',
      this.orderController.createOrderController,
    );
    this.router.get('/user/order',verifyToken, this.orderController.getOrderController);
    this.router.get('/admin/order',verifyToken, this.orderController.getOrderDetailsByAdminController);

    this.router.patch('/user/cancel-order',verifyToken, this.orderController.cancelOrderByUserController);
    this.router.patch('/admin/cancel-order',verifyToken, this.orderController.cancelOrderByAdminController);
    this.router.patch('/admin/send-order',verifyToken, this.orderController.sendOrderByAdminController);
    this.router.patch('/admin/confirm-payment',verifyToken, this.orderController.confirmPaymentController);
    this.router.patch('/user/finish-order',verifyToken, this.orderController.finishOrderByUserController);

  }

  getRouter(): Router {
    return this.router;
  }
}
