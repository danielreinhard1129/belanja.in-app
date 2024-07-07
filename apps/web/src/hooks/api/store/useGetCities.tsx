"use client";

import { axiosInstance } from "@/lib/axios";
import { City } from "@/types/city.type";
import { useEffect, useState } from "react";

const useGetCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const getCities = async () => {
    try {
      const { data } = await axiosInstance.get<City[]>("/stores/cities");
      setCities(data);
    } catch (error) {
      setCities([]);
    }
  };
  useEffect(() => {
    getCities();
  }, []);

  return { cities, refetch: getCities };
};

export default useGetCities;
