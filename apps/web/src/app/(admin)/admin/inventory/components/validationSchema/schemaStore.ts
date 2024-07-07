import { z } from "zod";

export const schemaStore = z.object({
  name: z.string().min(4, "Name must be at least 4 characters long"),
  cityId: z.string().min(1, "City is required"),
  storeAdminId: z.string().optional(),
});

export type SchemaStore = z.infer<typeof schemaStore>;

export const defaultValues: SchemaStore = {
  name: "",
  cityId: "",
  storeAdminId: "",
};
