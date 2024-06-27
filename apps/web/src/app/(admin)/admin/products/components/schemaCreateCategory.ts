import { z } from "zod";

export const schemaCreateCategory = z.object({
  id: z.number().optional(), // Menambahkan id untuk keperluan update
  name: z.string().min(4, "Name must be at least 4 characters long"),
});

export type SchemaCreateCategory = z.infer<typeof schemaCreateCategory>;

export const defaultValues: SchemaCreateCategory = {
  id: undefined,
  name: "",
};
