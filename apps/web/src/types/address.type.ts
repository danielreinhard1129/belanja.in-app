import { City } from "./city.type";
import { Province } from "./province.type";
import { Subdistrict } from "./subdistrict.type";

export interface Address {
  id: number;
  addressLine: string;
  lat: number;
  long: number;
  isPrimary: boolean;
  provinceId: number;
  cityId: number;
  subdistrictId: number;
  userId: number;
  provinces: Province;
  cities: City;
  subdistricts: Subdistrict;
}
