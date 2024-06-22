import { getStocksByStoreAdminService } from '@/services/store-product/get-stockByStoreAdmin.service';
import { getStocksByStoreService } from '@/services/store-product/get-stockByStore.service';
import { getStocksService } from '@/services/store-product/get-stocks.service';
import { getStocksByStoreAdminOrSuperAdminService } from '@/services/store-product/get-stocksByStoreAdminOrSuperAdmin.service';
import { NextFunction, Request, Response } from 'express';
export class StoreProductController {
  async getStocks(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: Number(req.query.take as string) || 5,
        page: Number(req.query.page as string) || 1,
        stockJournalsPage: Number(req.query.stockJournalsPage as string) || 5,
        stockJournalsTake: Number(req.query.stockJournalsTake as string) || 1,
        search: (req.query.search as string) || '',
        storeId: (req.query.storeId as string) || undefined,
      };
      const result = await getStocksService(req.body.user, query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStocksByStoreAdminOrSuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;
      const result = await getStocksByStoreAdminOrSuperAdminService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStocksBySuperAdmin(req: Request, res: Response, next: NextFunction) {
    const { employeeId } = req.query;

    try {
      const result = await getStocksByStoreAdminService(Number(employeeId));
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStocksByStore(req: Request, res: Response, next: NextFunction) {
    const storeId = req.query.storeId;

    try {
      const result = await getStocksByStoreService(Number(storeId));
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
