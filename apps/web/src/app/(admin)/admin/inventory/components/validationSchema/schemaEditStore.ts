import { z } from "zod";

export const schemaEditStore = z.object({
  name: z.string().min(4, "Name must be at least 4 characters long"),
  cityId: z.string().min(4, "City must be at least 4 characters long"),
  lat: z.string().min(4, "Lat must be at least 4 characters long"),
  long: z.string().min(4, "Long must be at least 4 characters long"),
  storeAdminId: z.string().optional(),
});

export type SchemaEditStore = z.infer<typeof schemaEditStore>;
