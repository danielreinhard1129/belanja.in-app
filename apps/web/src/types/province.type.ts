import { Address } from "./address.type";
import { City } from "./city.type";

export interface Province {
  id: number;
  provinceName: string;
  cities: City[];
  address: Address[];
}
