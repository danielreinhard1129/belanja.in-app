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
  cityId: string;
  storeAdminId: number;
  storeAdmin: StoreAdmin;
}

export interface IFormStore {
  name: string;
  lat: string;
  long: string;
  cityId: string;
  storeAdminId?: string;
}
