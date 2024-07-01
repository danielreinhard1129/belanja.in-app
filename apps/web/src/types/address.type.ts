import { User } from "./user.type";

export interface Province {
  id: number;
  provinceName: string;
}

export interface City {
  id: number;
  provinceId: number;
  citName: string;
  postal_code: string;
  storeId: number | null;
  province: Province;
}

export interface Subdistrict {
  id: number;
  cityId: number;
  subdistrictName: string;
}

export interface Address {
  id: number;
  addressLine: string;
  lat: number;
  long: number;
  isPrimary: boolean;
  postalCode: number;
  provinceId: number;
  cityId: number;
  subdistrictId: number;
  userId: number;
  user: User;
  cities: City;
  subdistricts: Subdistrict;
  isSelected: boolean;
}

export type AddressData = Address[];
