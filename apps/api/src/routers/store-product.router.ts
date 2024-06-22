import { StoreProductController } from '@/controllers/store-product.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/verifyToken';

export class StoreProductRouter {
  private router: Router;
  private storeProductController: StoreProductController;

  constructor() {
    this.storeProductController = new StoreProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.storeProductController.getStocks);
    this.router.get('/by-store', this.storeProductController.getStocksByStore);
    this.router.get(
      '/by-super-admin',
      this.storeProductController.getStocksBySuperAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
