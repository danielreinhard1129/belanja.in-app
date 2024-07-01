// export interface RajaOngkirResponse {
//   rajaongkir: {
//     query: Query;
//     status: Status;
//     origin_details: LocationDetails;
//     destination_details: LocationDetails;
//     results: CourierResult[];
//   };
// }

// export interface Query {
//   origin: string;
//   destination: string;
//   weight: number;
//   courier: string;
// }

// export interface Status {
//   code: number;
//   description: string;
// }

// export interface LocationDetails {
//   city_id: string;
//   province_id: string;
//   province: string;
//   type: string;
//   city_name: string;
//   postal_code: string;
// }

// export interface CourierResult {
//   code: string;
//   name: string;
//   costs: Cost[];
// }

// export interface Cost {
//   service: string;
//   description: string;
//   cost: CostDetail[];
// }

// export interface CostDetail {
//   value: number;
//   etd: string;
//   note: string;
// }

export interface CourierService {
  code: string;
  name: string;
  costs: ServiceCost[];
  isSelected: boolean
}

export interface ServiceCost {
  service: string;
  description: string;
  cost: CostDetail[];
  isSelected: boolean
}

export interface CostDetail {
  value: number;
  etd: string;
  note: string;
}
