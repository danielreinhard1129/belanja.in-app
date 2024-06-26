import { getStockJournalByStoreService } from '@/services/stock-journal/get-stockJournalByStore.service';
import { getStockJournalsByStoreWithParamsService } from '@/services/stock-journal/get-stockJournalsByStoreWithParams.service';
import { NextFunction, Request, Response } from 'express';
export class StockJournalController {
  async getStockJournalsByStoreWithParams(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        storeId: (req.query.storeId as string) || undefined,
      };
      const result = await getStockJournalsByStoreWithParamsService(
        res.locals.user,
        query,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getStockJournalByStore(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
      };
      const result = await getStockJournalByStoreService(
        res.locals.user,
        query,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
