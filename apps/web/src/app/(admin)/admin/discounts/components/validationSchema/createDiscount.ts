import { z } from "zod";

export const createStore = z.object({
  title: z.string().min(4, "title must be at least 4 characters long"),
  desc: z.string().min(10, "desc must be at least 4 characters long"),
  discountType: z
    .string()
    .min(4, "Discount type must be at least 4 characters long"),
  discountvalue: z.number().min(0, "Discount value must be at least 0"),
  discountLimit: z.number().min(0, "Discount value must be at least 0"),
  minPurchase: z.number().optional(),
  productId: z.string(),
});

export type CreateStore = z.infer<typeof createStore>;

export const defaultValues: CreateStore = {
  title: "",
  desc: "",
  discountType: "",
  discountvalue: 0,
  discountLimit: 0,
  minPurchase: undefined,
  productId: "",
};
