import { getStocksByStoreAdminService } from '@/services/store-product/get-stockByStoreAdmin.service';
import { getStocksService } from '@/services/store-product/get-stocks.service';
import { NextFunction, Request, Response } from 'express';
import { getProductsByStoreService } from '@/services/store-product/get-productsByStore.service';
import { createStockProductMutationService } from '@/services/store-product/create-stockProductMutation.service';
export class StoreProductController {
  async getStocks(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: Number(req.query.take as string) || 5,
        page: Number(req.query.page as string) || 1,
        // stockJournalsPage: Number(req.query.stockJournalsPage as string) || 5,
        // stockJournalsTake: Number(req.query.stockJournalsTake as string) || 1,
        search: (req.query.search as string) || '',
        storeId: (req.query.storeId as string) || undefined,
      };
      const result = await getStocksService(res.locals.user, query);

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

  async getProductsByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getProductsByStoreService(Number(req.params.id));
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async createStoreProductMutation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createStockProductMutationService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
