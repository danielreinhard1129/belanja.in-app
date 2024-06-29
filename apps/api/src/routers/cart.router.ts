import { CartController } from '@/controllers/cart.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
  
    this.router.patch(
      '/user/increment-cart',
      verifyToken,
      this.cartController.incrementQtyController,
    );
    this.router.patch(
      '/user/decrement-cart',
      verifyToken,
      this.cartController.decrementQtyController,
    );
    this.router.patch(
      '/user/remove-item',
      verifyToken,
      this.cartController.removeItemController,
    );

    this.router.get('/:id', this.cartController.getCartController);
  }

  getRouter(): Router {
    return this.router;
  }
}
