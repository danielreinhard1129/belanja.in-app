import { getStockJournalByStoreAdminService } from '@/services/stock-journal/get-stockJournalByStoreAdmin.service';
import { getStockJournalsByStoreSuperAdminService } from '@/services/stock-journal/get-stockJournalsByStoreSuperAdmin.service';
import { getStockJournalsByStoreWithParamsService } from '@/services/stock-journal/get-stockJournalsByStoreWithParams.service';
import { getStockJournalsSuperAdminNotificationsService } from '@/services/stock-journal/get-stockJournalsSuperAdminNotifications.service';
import { updateStockJournalsSuperAdminNotificationsService } from '@/services/stock-journal/update-stockJournalSuperAdminNotification.service';
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
        status: (req.query.status as string) || 'all',
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
  async getStockJournalsByStoreSuperAdmin(
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
        status: (req.query.status as string) || 'all',
        storeId: (req.query.storeId as string) || undefined,
      };
      const result = await getStockJournalsByStoreSuperAdminService(
        res.locals.user,
        query,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getStockJournalByStoreAdmin(
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
        status: (req.query.status as string) || 'all',
        search: (req.query.search as string) || '',
      };
      const result = await getStockJournalByStoreAdminService(
        res.locals.user,
        query,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStockJournalsSuperAdminNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getStockJournalsSuperAdminNotificationsService(
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateStockJournalsSuperAdminNotifications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await updateStockJournalsSuperAdminNotificationsService(
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
