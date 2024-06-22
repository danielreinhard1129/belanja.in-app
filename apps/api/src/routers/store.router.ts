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
    this.router.post('/', verifyToken, this.storeController.createStore);
    this.router.get('/:id', this.storeController.getStoresByEmployeeOrAdmin);
  }

  getRouter(): Router {
    return this.router;
  }
}
