import { Province } from "./province.type";

export interface City {
  id: number;
  provinceId: number;
  citName: string;
  postal_code: string;
  province: Province;
}
