import { z } from "zod";

export const createStore = z.object({
  title: z.string().min(4, "title must be at least 4 characters long"),
  desc: z.string().min(10, "desc must be at least 4 characters long"),
  discountType: z
    .string()
    .min(4, "Discount type must be at least 4 characters long"),
  discountValue: z.number().min(0, "Discount value must be at least 0"),
  minPurchase: z.number().optional(),
  //   startDate: z.date().optional(),
  //   endDate: z.date().optional(),
  productId: z.string().optional(),
});

export type CreateStore = z.infer<typeof createStore>;

export const defaultValues: CreateStore = {
  title: "",
  desc: "",
  discountType: "",
  discountValue: 0,
  minPurchase: undefined,
  //   startDate: undefined,
  //   endDate: undefined,
  productId: "",
};
