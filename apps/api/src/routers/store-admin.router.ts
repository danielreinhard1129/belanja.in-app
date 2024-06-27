import { StoreAdminController } from '@/controllers/store-admin.controller';
import { Router } from 'express';

export class StoreAdminRouter {
  private router: Router;
  private storeAdminController: StoreAdminController;

  constructor() {
    this.storeAdminController = new StoreAdminController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.storeAdminController.getStoreAdmins);
    this.router.get(
      '/no-store',
      this.storeAdminController.getStoreAdminsNoStore,
    );
    this.router.get('/:id', this.storeAdminController.getStoreAdminById);
  }

  getRouter(): Router {
    return this.router;
  }
}
