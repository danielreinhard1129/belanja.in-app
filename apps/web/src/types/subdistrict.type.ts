import { Address } from "./address.type";
import { City } from "./city.type";

export interface Subdistrict {
  id: number;
  cityId: number;
  subdistrictName: string;
  city: City;
  Address: Address[];
}
