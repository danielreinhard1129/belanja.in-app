
import { RAJAONGKIR_API_KEY, RO_KEY } from '@/config';
import { RajaOngkirResponse } from '@/types/rajaongkir-response.type';
import axios, { AxiosError } from 'axios';

interface DeliveryArgs {
  weight: number;
  origin: string;
  destination: string;
}

const COURIERS = ['jne', 'pos', 'tiki'];

const getOptions = (origin: string, destination: string, weight: number, courier: string) => ({
  method: 'POST',
  url: 'https://api.rajaongkir.com/starter/cost',
  headers: {
    // key: RAJAONGKIR_API_KEY,
    key: RO_KEY,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: new URLSearchParams({
    origin,
    destination,
    weight: weight.toString(),
    courier,
  }).toString(),
});

const formatResponse = (data: RajaOngkirResponse, isSelected: boolean) => {
  const results = data.rajaongkir.results[0];
  const costs = results.costs.map((cost, index) => ({
    ...cost,
    isSelected: index === 0,
  }));
  return { ...results, costs, isSelected };
};

export const getDeliveryFeeService = async (body: DeliveryArgs) => {
  const { origin, destination, weight } = body;

  try {
    const requests = COURIERS.map(courier => axios<RajaOngkirResponse>(getOptions(origin, destination, weight, courier)));
    const responses = await Promise.all(requests);

    const results = responses.map((response, index) => formatResponse(response.data, index === COURIERS.length - 1));
    return results;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error(errorMessage);
      throw new Error(`Error occurred when calculating shipping cost: ${errorMessage}`);
    }
    throw error;
  }
};
