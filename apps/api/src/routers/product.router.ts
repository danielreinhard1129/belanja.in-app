import { ProductController } from '@/controllers/product.controller';
import { createProductValidator } from '@/middlewares/createProductValidator';
import { updateProductValidator } from '@/middlewares/updateProductValidator';
import { uploader } from '@/libs/uploader';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/filters',
      this.productController.getProductsByParamsController,
    );
    this.router.get(
      '/location',
      this.productController.getProductsByLocationController,
    );
    this.router.post(
      '/',
      verifyToken,
      uploader('IMG', '/images').array('images', 5),
      createProductValidator,
      this.productController.createProduct,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      uploader('IMG', '/images').array('images', 5),
      updateProductValidator,
      this.productController.updateProduct,
    );
    this.router.get('/', this.productController.getProducts);
    this.router.get('/:id', this.productController.getProduct);
    this.router.get('/:id', this.productController.getProductById);
    this.router.delete(
      '/records',
      verifyToken,
      this.productController.deleteManyProducts,
    );
    this.router.delete(
      '/:id',
      verifyToken,
      this.productController.deleteProduct,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
