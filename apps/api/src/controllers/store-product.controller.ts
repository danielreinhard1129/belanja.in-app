import { arriveStockProductMutationService } from '@/services/store-product/arrive-stockProductMutation.service';
import { confirmStockProductMutationService } from '@/services/store-product/confirm-stockProductMutation.service';
import { createRequestStockProductMutationService } from '@/services/store-product/create-requestStockMutation.service';
import { createStockProductMutationService } from '@/services/store-product/create-stockProductMutation.service';
import { createStockSuperAdminService } from '@/services/store-product/create-stockSuperAdmin.service';
import { getProductsByStoreService } from '@/services/store-product/get-productsByStore.service';
import { getStocksByStoreAdminService } from '@/services/store-product/get-stockByStoreAdmin.service';
import { getStocksService } from '@/services/store-product/get-stocks.service';
import { rejectStockProductMutationService } from '@/services/store-product/reject-stockProductMutation.service';
import { NextFunction, Request, Response } from 'express';
export class StoreProductController {
  async getStocks(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: Number(req.query.take as string) || 5,
        page: Number(req.query.page as string) || 1,
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

  async createRequestStoreProductMutation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await createRequestStockProductMutationService(
        req.body,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async confirmStockProductMutation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await confirmStockProductMutationService(
        Number(req.params.id),
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async rejectStockProductMutation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await rejectStockProductMutationService(
        Number(req.params.id),
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async arriveStockProductMutation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await arriveStockProductMutationService(
        Number(req.params.id),
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async createStockSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createStockSuperAdminService(
        req.body,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
