import { VoucherController } from '@/controllers/voucher.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;

  constructor() {
    this.voucherController = new VoucherController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/store-admin',
      verifyToken,
      this.voucherController.getVouchersByStoreAdmin,
    );
    this.router.get(
      '/super-admin',
      verifyToken,
      this.voucherController.getVouchersBySuperAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
