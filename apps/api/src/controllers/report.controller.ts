import { getMostBuyProductService } from '@/services/report/get-most-buy-product.service';
import { getSalesReportService } from '@/services/report/get-salesReport.service';
import { getSalesReportByCategoryService } from '@/services/report/get-salesReportByCategory.service';
import { getSalesReportByProductService } from '@/services/report/get-salesReportByProduct.service';
import { NextFunction, Request, Response } from 'express';

export class ReportController {
  async getSalesReportController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        storeId: (req.query.storeId as string) || undefined,
        filterMonth: req.query.filterMonth as string,
        filterYear: req.query.filterYear as string,
      };
      const result = await getSalesReportService(query, res.locals.user);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getSalesReportByCategoryController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        storeId: (req.query.storeId as string) || undefined,
        categoryId: (req.query.categoryId as string) || undefined,
        filterMonth: req.query.filterMonth as string,
        filterYear: req.query.filterYear as string,
      };
      const result = await getSalesReportByCategoryService(
        query,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getSalesReportByProductController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        storeId: (req.query.storeId as string) || undefined,
        productId: (req.query.productId as string) || undefined,
        filterMonth: req.query.filterMonth as string,
        filterYear: req.query.filterYear as string,
      };
      const result = await getSalesReportByProductService(
        query,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getMostBuyProductController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        storeId: (req.query.storeId as string) || undefined,
        productId: (req.query.productId as string) || undefined,
      };
      const id = res.locals.user;
      const result = await getMostBuyProductService(query, id);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
