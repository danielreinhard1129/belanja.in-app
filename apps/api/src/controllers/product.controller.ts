import { createProductService } from '@/services/product/create-product.service';
import { deleteManyProductsService } from '@/services/product/delete-many.product.service';
import { deleteProductService } from '@/services/product/delete-product.service';
import { getProductService } from '@/services/product/get-product.service';
import { getProductByIdService } from '@/services/product/get-productById.service';
import { getProductsByLocationService } from '@/services/product/get-products-by-location.service';
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
      const { lat, long, radius, productId } = req.query;
      const query = {
        lat: parseFloat(lat as string),
        long: parseFloat(long as string),
        radius: parseFloat(radius as string) || 50,
        productId: parseInt(productId as string),
      };

      const result = await getProductService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getProductByIdService(Number(req.params.id));

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

  async getProductsByLocationController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { lat, long, radius } = req.query;
      const query = {
        lat: parseFloat(lat as string),
        long: parseFloat(long as string),
        radius: parseFloat(radius as string) || 50,
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        category: (req.query.category as string) || 'all',
      };

      const result = await getProductsByLocationService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
