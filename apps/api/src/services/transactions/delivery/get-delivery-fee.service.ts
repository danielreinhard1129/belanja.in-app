// import { RAJAONGKIR_API_KEY } from '@/config';
// import { RajaOngkirResponse } from '@/types/rajaongkir-response.type';
// import axios, { AxiosError } from 'axios';

// interface DeliveryArgs {
//   weight: number;
//   origin: string;
//   destination: string;
// }

// export const getDeliveryFeeService = async (body: DeliveryArgs) => {
//   try {
//     const { origin, destination, weight } = body;

//     const options1 = {
//       method: 'POST',
//       url: 'https://api.rajaongkir.com/starter/cost',
//       headers: {
//         key: RAJAONGKIR_API_KEY,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data: new URLSearchParams({
//         origin,
//         destination,
//         weight: weight.toString(), // Convert weight to string
//         courier: 'jne',
//       }).toString(),
//     };
//     const options2 = {
//       method: 'POST',
//       url: 'https://api.rajaongkir.com/starter/cost',
//       headers: {
//         key: RAJAONGKIR_API_KEY,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data: new URLSearchParams({
//         origin,
//         destination,
//         weight: weight.toString(), // Convert weight to string
//         courier: 'pos',
//       }).toString(),
//     };
//     const options3 = {
//       method: 'POST',
//       url: 'https://api.rajaongkir.com/starter/cost',
//       headers: {
//         key: RAJAONGKIR_API_KEY,
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       data: new URLSearchParams({
//         origin,
//         destination,
//         weight: weight.toString(), // Convert weight to string
//         courier: 'tiki',
//       }).toString(),
//     };

//     const response1 = await axios<RajaOngkirResponse>(options1);
//     const response2 = await axios<RajaOngkirResponse>(options2);
//     const response3 = await axios<RajaOngkirResponse>(options3);

//     const data1 = response1.data.rajaongkir.results[0];

//     const deliveryFee = data1.costs.map((data, index) => {
//       return { ...data, isSelected: !index };
//     });

//     const returnValue1 = { ...data1, costs: deliveryFee, isSelected: false};


//     const data2 = response2.data.rajaongkir.results[0];

//     const deliveryFee2 = data2.costs.map((data, index) => {
//       return { ...data, isSelected: !index };
//     });

//     const returnValue2 = { ...data2, costs: deliveryFee2, isSelected: false };

//     const data3 = response3.data.rajaongkir.results[0];

//     const deliveryFee3 = data3.costs.map((data, index) => {
//       return { ...data, isSelected: !index };
//     });

//     const returnValue3 = { ...data3, costs: deliveryFee3, isSelected: true};


//     const result = [returnValue1, returnValue2, returnValue3];

    

//     return result;
//   } catch (error) {
//     if (error instanceof AxiosError) {
//       console.log(error.response?.data?.message || error.message);
//       // console.log(error);

//       throw new Error(
//         `Error occurred when calculating shipping cost: ${error.response?.data?.message || error.message}`,
//       );
//     }
//   }
// };
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
