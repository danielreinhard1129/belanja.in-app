import { ProductController } from '@/controllers/product.controller';
import { uploader } from '@/libs/uploader';
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
      '/filter',
      this.productController.getProductsByParamsController,
    );
    this.router.post(
      '/',
      uploader('IMG', '/images').array('images', 5),
      this.productController.createProduct,
    );
    this.router.patch(
      '/:id',
      uploader('IMG', '/images').array('images', 5),
      this.productController.updateProduct,
    );
    this.router.get('/', this.productController.getProducts);
    this.router.get('/:id', this.productController.getProduct);
    this.router.delete('/delete', this.productController.deleteManyProducts);
    this.router.delete('/:id', this.productController.deleteProduct);
  }

  getRouter(): Router {
    return this.router;
  }
}
