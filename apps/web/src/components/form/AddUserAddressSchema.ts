import { z } from "zod";

export const FormSchema = z.object({
  addressLine: z
    .string({
      required_error: "Address line is required",
    })
    .min(2, {
      message: "Address must be at least 2 characters.",
    }),
  postalCode: z.number({
    required_error: "City is required",
  }),
  cityId: z.number({
    required_error: "City is required",
  }),
  provinceId: z.number({
    required_error: "Province ID is required",
  }),
  subdistrictId: z.number({
    required_error: "Subdistrict ID is required",
  }),
});
