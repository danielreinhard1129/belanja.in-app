import { AddressController } from '@/controllers/address.controller';
import { Router } from 'express';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.router = Router();
    this.addressController = new AddressController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.addressController.getAddressByUserIdController);
  }

  public getRouter(): Router {
    return this.router;
  }
}
