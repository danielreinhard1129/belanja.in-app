import { ReportController } from '@/controllers/report.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;

  constructor() {
    this.reportController = new ReportController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/sales',
      verifyToken,
      this.reportController.getSalesReportController,
    );
    this.router.get(
      '/category',
      verifyToken,
      this.reportController.getSalesReportByCategoryController,
    );
    this.router.get(
      '/product',
      verifyToken,
      this.reportController.getSalesReportByProductController,
    );
    this.router.get(
      '/most-buy',
      verifyToken,
      this.reportController.getMostBuyProductController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
