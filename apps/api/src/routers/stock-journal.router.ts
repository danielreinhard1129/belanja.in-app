import { StockJournalController } from '@/controllers/stock-journal.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class StockJournalRouter {
  private router: Router;
  private stockJournalController: StockJournalController;

  constructor() {
    this.stockJournalController = new StockJournalController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/filter',
      verifyToken,
      this.stockJournalController.getStockJournalsByStoreWithParams,
    );
    this.router.get(
      '/',
      verifyToken,
      this.stockJournalController.getStockJournalByStoreAdmin,
    );
    this.router.get(
      '/super-admin',
      verifyToken,
      this.stockJournalController.getStockJournalsByStoreSuperAdmin,
    );
    this.router.get(
      '/super-admin/notifications',
      verifyToken,
      this.stockJournalController.getStockJournalsSuperAdminNotifications,
    );
    this.router.post(
      '/super-admin/update-notifications',
      verifyToken,
      this.stockJournalController.updateStockJournalsSuperAdminNotifications,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
