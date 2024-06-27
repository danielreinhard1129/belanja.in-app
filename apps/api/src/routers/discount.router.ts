import { DiscountController } from '@/controllers/discount.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;

  constructor() {
    this.discountController = new DiscountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/store-admin',
      verifyToken,
      this.discountController.getDiscountsByStoreAdmin,
    );
    this.router.get(
      '/super-admin',
      verifyToken,
      this.discountController.getDiscountsBySuperAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
