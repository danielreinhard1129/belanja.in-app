import { StoreController } from '@/controllers/store.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class StoreRouter {
  private router: Router;
  private storeController: StoreController;

  constructor() {
    this.storeController = new StoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.storeController.getStores);
    this.router.get('/cities', this.storeController.getCities);
    this.router.get(
      '/store-admin/:id',
      this.storeController.getStoreByStoreAdmin,
    );
    this.router.post('/', verifyToken, this.storeController.createStore);
    this.router.get('/filter', this.storeController.getStoresByParams);
    this.router.get('/:id', this.storeController.getStore);
    this.router.patch('/:id', verifyToken, this.storeController.updateStore);
    this.router.delete('/:id', verifyToken, this.storeController.deleteStore);
  }

  getRouter(): Router {
    return this.router;
  }
}
