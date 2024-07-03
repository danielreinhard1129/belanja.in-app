import { City } from "./city.type";
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
  City: City;
  storeAdminId: number;
  storeAdmin: StoreAdmin;
}

export interface IFormStore {
  name: string;
  cityId: string;
  storeAdminId?: string;
}
