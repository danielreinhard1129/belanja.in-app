"use client";

import useAxios from "@/hooks/api/useAxios";
import { useState } from "react";

interface Component {
  county: string;
  country: string;
}

interface OpenCageResult {
  geometry: { lat: any; lng: any; };
  formatted: string;
  components: Component;
}

interface OpenCageData {
  results: OpenCageResult[];
}

export default function useGetLocationByCoordinates() {
  const [data, setData] = useState<OpenCageData | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const { axiosInstance } = useAxios();

  async function getLocation(lat: number, lng: number) {
    try {
      const response = await axiosInstance.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&key=1fe9dce2ebaf4e918bdd67188a11377a`,
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch location data:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  return { getLocation, data, isLoading };
}
