import { StoreAdmin } from "./storeAdmin.type";

export interface Store {
  id: number;
  name: string;
  qty: number;
  lat: string;
  long: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  city: string;
  storeAdminId: number;
  storeAdmin: StoreAdmin;
}

export interface IFormStore {
  name: string;
  lat: string;
  long: string;
  city: string;
  storeAdminId?: string;
}
