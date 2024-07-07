"use client";

import { axiosInstance } from "@/lib/axios";
import { useState, useEffect } from "react";

interface OpenCageResult {
  lat: number;
  lng: number;
}

export default function useGetCoordinatesByLocation() {
  const [data, setData] = useState<OpenCageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const removePrefix = (str: string) => {
    if (str.startsWith("Kota ")) {
      return str.slice(5);
    } else if (str.startsWith("Kabupaten ")) {
      return str.slice(10);
    } else {
      return str;
    }
  };

  const convertString = (str: string) => {
    return str.includes(" ") ? str.replace(/ /g, "+") : str;
  };

  const getCoordinates = async (city: string, province: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${removePrefix(city)}%2C+${convertString(province)}&key=1fe9dce2ebaf4e918bdd67188a11377a`,
      );
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setData({ lat, lng });
      } else {
        setError("No results found");
        setData(null);
      }
    } catch (error) {
      console.error("Failed to fetch location", error);
      setError("Failed to fetch location");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { getCoordinates, data, isLoading, error };
}
