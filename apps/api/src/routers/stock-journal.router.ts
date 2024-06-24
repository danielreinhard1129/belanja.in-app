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
      this.stockJournalController.getStockJournalByStore,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
