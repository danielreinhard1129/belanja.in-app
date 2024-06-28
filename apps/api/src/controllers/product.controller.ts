import { createProductService } from '@/services/product/create-product.service';
import { deleteManyProductsService } from '@/services/product/delete-many.product.service';
import { deleteProductService } from '@/services/product/delete-product.service';
import { getProductService } from '@/services/product/get-product.service';
import { getProductsService } from '@/services/product/get-products.service';
import { getProductsByParamsService } from '@/services/product/get-productsByParams.service';
import { updateProductService } from '@/services/product/update-product.service';
import { NextFunction, Request, Response } from 'express';
export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new Error('No file uploaded');
      }

      const result = await createProductService(req.body, files);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getProductsService();

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductsByParamsController(
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
        category: (req.query.category as string) || 'all',
      };
      const result = await getProductsByParamsService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getProductService(Number(req.params.id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];

      const result = await updateProductService(
        Number(req.params.id),
        req.body,
        files,
      );

      return res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteProductService(Number(req.params.id), res.locals.user);

      return res.status(200).send({
        message: 'delete product success',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteManyProducts(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteManyProductsService(req.body.productId, res.locals.user);
      return res.status(200).send({
        message: 'delete product success',
      });
    } catch (error) {
      next(error);
    }
  }
}
