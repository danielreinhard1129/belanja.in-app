import { Province } from "./province.type";
import { Subdistrict } from "./subdistrict.type";

export interface City {
  id: number;
  provinceId: number;
  citName: string;
  postal_code: string;
  province: Province;
  subdistricts: Subdistrict[];
}
