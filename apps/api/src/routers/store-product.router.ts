import { StoreProductController } from '@/controllers/store-product.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

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
    this.router.post(
      '/request-mutation',
      verifyToken,
      this.storeProductController.createRequestStoreProductMutation,
    );
    this.router.post(
      '/super-admin',
      verifyToken,
      this.storeProductController.createStockSuperAdmin,
    );
    this.router.post(
      '/confirm/:id',
      verifyToken,
      this.storeProductController.confirmStockProductMutation,
    );
    this.router.post(
      '/reject/:id',
      verifyToken,
      this.storeProductController.rejectStockProductMutation,
    );
    this.router.post(
      '/arrive/:id',
      verifyToken,
      this.storeProductController.arriveStockProductMutation,
    );
    this.router.get('/:id', this.storeProductController.getProductsByStore);
    this.router.get(
      '/by-super-admin',
      this.storeProductController.getStocksBySuperAdmin,
    );
    this.router.post(
      '/:id',
      verifyToken,
      this.storeProductController.updateIsActiveStockSuperAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
