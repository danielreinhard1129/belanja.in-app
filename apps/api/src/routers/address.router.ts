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
    this.router.get('/get-address/:id', this.addressController.getAddressByIdController);
    this.router.get('/:id', this.addressController.getAddressController);
    this.router.post(
      '/add-address',
      this.addressController.addAddressController,
    );
    this.router.patch(
      '/update-address/:id',
      this.addressController.updateAddressController,
    );
    this.router.delete(
      '/delete-address/:id',
      this.addressController.deleteAddressController,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
