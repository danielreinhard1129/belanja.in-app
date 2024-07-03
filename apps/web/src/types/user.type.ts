import { StoreAdmin } from "./storeAdmin.type";

export interface User {
  id: number;
  name: string;
  email: string;
  addressId: number;
  role: string;
  provider: string;
  birthDate?: Date;
  gender: string;
  password: string;
  isVerified: boolean;
  referral: string;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
  storeAdmin: StoreAdmin;
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
  provinces: Province;
  cities: City;
  subdistricts: Subdistrict;
  user: User;
  Delivery: Delivery[];
  isSelected: boolean;
}

export interface City {
  id: number;
  provinceId?: number;
  citName?: string;
  postal_code?: string;
  province?: Province;
  subdistricts: Subdistrict[];
  addresses: Address[];
}

export interface Province {
  id: number;
  provinceName?: string;
  cities: City[];
  addresses: Address[];
}

export interface Subdistrict {
  id: number;
  cityId?: number;
  subdistrictName?: string;
  city?: City;
  Address: Address[];
}

interface Delivery {
  id: number;
  addressId: number;
  address: Address;
  // Other fields for Delivery model
}
