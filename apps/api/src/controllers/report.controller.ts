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
        categoryId: (req.query.categoryId as string) || undefined,
        productId: (req.query.productId as string) || undefined,
        filterDate: req.query.filterDate
          ? new Date(req.query.filterDate as string)
          : undefined,
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
        month: (req.params.date as string) || '',
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
        month: (req.params.date as string) || '',
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
}
