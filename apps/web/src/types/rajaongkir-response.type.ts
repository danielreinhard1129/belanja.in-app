
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
