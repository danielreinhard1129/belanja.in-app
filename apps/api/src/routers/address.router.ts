import { AddressController } from '@/controllers/address.controller';
import { Router } from 'express';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.addressController = new AddressController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/provinces',
      this.addressController.getProvincesController,
    );
    this.router.get('/cities', this.addressController.getCitiesController);
    this.router.get(
      '/subdistricts',
      this.addressController.getSubdistrictsController,
    );
    this.router.get(
      '/:id',
      this.addressController.getAddressByIdController,
    );
    this.router.get('/user/:id', this.addressController.getAddressesController);
    this.router.post(
      '/',
      this.addressController.addAddressController,
    );
    this.router.patch(
      '/:id',
      this.addressController.updateAddressController,
    );
    this.router.delete(
      '/:id',
      this.addressController.deleteAddressController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
