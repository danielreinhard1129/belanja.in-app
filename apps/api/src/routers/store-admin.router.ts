import { StoreAdminController } from '@/controllers/store-admin.controller';
import { verifyToken } from '@/middlewares/verifyToken';
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
    this.router.post(
      '/',
      verifyToken,
      this.storeAdminController.createStoreAdmin,
    );
    this.router.post(
      '/reset/:id',
      verifyToken,
      this.storeAdminController.updateResetPasswordStoreAdmin,
    );
    this.router.get(
      '/no-store',
      this.storeAdminController.getStoreAdminsNoStore,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      this.storeAdminController.updateStoreAdmin,
    );
    this.router.get('/:id', this.storeAdminController.getStoreAdminById);
  }

  getRouter(): Router {
    return this.router;
  }
}
