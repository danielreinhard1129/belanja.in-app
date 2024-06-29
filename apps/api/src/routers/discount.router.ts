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
    this.router.delete(
      '/:id',
      verifyToken,
      this.discountController.deleteDiscount,
    );
    this.router.post('/', verifyToken, this.discountController.createDiscount);
    this.router.patch(
      '/:id',
      verifyToken,
      this.discountController.updateDiscount,
    );
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
    this.router.get('/:id', this.discountController.getDiscount);
  }

  getRouter(): Router {
    return this.router;
  }
}
