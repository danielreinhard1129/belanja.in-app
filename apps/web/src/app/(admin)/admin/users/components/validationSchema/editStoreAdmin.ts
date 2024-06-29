import { z } from "zod";

export const editStoreAdmin = z.object({
  nip: z.number().nonnegative("Nip value must be at least 0"),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters.",
    }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Invalid email address"),
});

export type EditStoreAdmin = z.infer<typeof editStoreAdmin>;

export const defaultValues: EditStoreAdmin = {
  nip: 0,
  name: "",
  email: "",
};
