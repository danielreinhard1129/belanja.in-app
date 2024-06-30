import { getDeliveryFeeService } from "@/services/transactions/delivery/get-delivery-fee.service";
import { NextFunction, Request, Response } from "express";

export class DeliveryController {
    async getDeliveryFeeController(
        req: Request,
        res: Response,
        next: NextFunction,
      ) {
        try {
          const { payload } = req.body;
          const result = await getDeliveryFeeService(payload);
    
          return res.status(200).send(result);
        } catch (error) {
          next(error);
        }
      }
}