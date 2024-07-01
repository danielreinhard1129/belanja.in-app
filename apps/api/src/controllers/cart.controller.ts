import { addQtyService } from '@/services/cart/add-qty.service';
import { addToCartService } from '@/services/cart/add-to-cart.service';
import { getCartService } from '@/services/cart/get-cart.service';
import { removeItemService } from '@/services/cart/remove-item.service';
import { subQtyService } from '@/services/cart/sub-qty.service';
import { Request, Response, NextFunction } from 'express';

export class CartController {
  async getCartController(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = Number(req.params.id);
      const result = await getCartService(userId);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async incrementQtyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const cartId = req.body.cartId;
      const userId = Number(res.locals.user.id);

      const result = await addQtyService({ cartId, userId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async decrementQtyController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const cartId = req.body.cartId;
      const userId = Number(res.locals.user.id);

      const result = await subQtyService({ cartId, userId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async removeItemController(req: Request, res: Response, next: NextFunction) {
    try {
      const cartId = req.body.cartId;
      const userId = Number(res.locals.user.id);

      const result = await removeItemService({ cartId, userId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async addToCartController(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, storeId } = req.body;
      const userId = Number(res.locals.user.id);

      const result = await addToCartService({ productId, userId, storeId });

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
