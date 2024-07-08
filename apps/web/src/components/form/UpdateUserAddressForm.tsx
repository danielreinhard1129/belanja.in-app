"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetAddress from "@/hooks/api/address/useGetAddress";
import useGetCities from "@/hooks/api/address/useGetCities";
import useGetProvinces from "@/hooks/api/address/useGetProvinces";
import useGetSubdistricts from "@/hooks/api/address/useGetSubdistricts";
import useUpdateAddress from "@/hooks/api/address/useUpdateAddress";
import { getChangedValues } from "@/utils/getChangeValue";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Map from "../Map";
import { FormSchema } from "./AddUserAddressSchema";

interface UpdateUserAddressFormProps {
  addressId: number;
  userId: number;
}

const UpdateUserAddressForm: React.FC<UpdateUserAddressFormProps> = ({
  addressId,
  userId,
}) => {
  const { updateAddress } = useUpdateAddress(addressId, userId);
  const {
    address,
    isLoading: addressLoading,
    refetch: refetchGetAddress,
  } = useGetAddress(addressId);
  const router = useRouter();

  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [selectedSubdistrictId, setSelectedSubdistrictId] =
    useState<string>("");
  const [locationData, setLocationData] = useState<{
    lat: number;
    long: number;
  } | null>(null);

  const { data: provinces, isLoading: provincesLoading } = useGetProvinces({});
  const {
    data: cities,
    isLoading: citiesLoading,
    refetch: refetchCities,
  } = useGetCities({
    provinceId: selectedProvinceId,
  });
  const {
    data: subdistricts,
    isLoading: subdistrictsLoading,
    refetch: refetchSubdistricts,
  } = useGetSubdistricts({
    cityId: parseInt(selectedCityId),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      addressLine: "",
      postalCode: "",
      subdistrictId: 0,
      cityId: 0,
      provinceId: 0,
    },
  });

  useEffect(() => {
    if (address) {
      setSelectedProvinceId(address.provinceId.toString());
      setSelectedCityId(address.cityId.toString());
      setSelectedSubdistrictId(address.subdistrictId.toString());
      setLocationData({ lat: address.lat, long: address.long });

      setTimeout(() => {
        form.reset({
          addressLine: address.addressLine,
          postalCode: address.postalCode?.toString(),
          subdistrictId: address.subdistrictId,
          cityId: address.cityId,
          provinceId: address.provinceId,
        });
      }, 300);
    }
  }, [address, form]);

  useEffect(() => {
    if (selectedProvinceId) {
      refetchCities();
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedCityId) {
      refetchSubdistricts();
    }
  }, [selectedCityId]);

  const handleLocationSelect = (loc: any) => {
    setLocationData(loc);
  };

  const onSubmit = async (values: any) => {
    if (locationData) {
      const { lat, long } = locationData;
      const dataToSubmit = { ...values, lat, long };
      await updateAddress(getChangedValues(dataToSubmit, address));
      await refetchGetAddress();
    }
  };

  if (
    addressLoading ||
    provincesLoading ||
    citiesLoading ||
    subdistrictsLoading
  ) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="container flex w-full flex-col px-4"
      >
        <div className="space-y-4">
          <div className="container flex h-fit w-full items-center justify-between gap-4 bg-white px-0 pb-4 pt-4 md:justify-start">
            <Button
              variant="secondary"
              className="rounded-full p-2 text-black hover:bg-gray-400 hover:text-white"
              onClick={() => router.push(`/user/${userId}`)}
            >
              <ChevronLeft size={16} />
            </Button>
            <h1 className="text-lg font-medium">Edit Address</h1>
            <Button
              variant="secondary"
              className="rounded-full p-2 opacity-0"
              onClick={() => router.push("/")}
            >
              <ChevronLeft size={16} color="black" />
            </Button>
          </div>
          <FormField
            control={form.control}
            name="addressLine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your postal code"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="provinceId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province ID</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      setSelectedProvinceId(value);
                      form.setValue("provinceId", parseInt(value));
                    }}
                    value={field.value?.toString() || selectedProvinceId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem
                          key={province.id}
                          value={province.id.toString()}
                        >
                          {province.provinceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      setSelectedCityId(value);
                      form.setValue("cityId", parseInt(value));
                      setSelectedSubdistrictId("");
                    }}
                    value={field.value?.toString() || selectedCityId}
                    disabled={!selectedProvinceId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.citName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subdistrictId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subdistrict</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      setSelectedSubdistrictId(value);
                      form.setValue("subdistrictId", parseInt(value));
                    }}
                    value={field.value?.toString() || selectedSubdistrictId}
                    disabled={!selectedCityId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subdistrict" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subdistricts.map((subdistrict) => (
                        <SelectItem
                          key={subdistrict.id}
                          value={subdistrict.id.toString()}
                        >
                          {subdistrict.subdistrictName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedCityId && selectedProvinceId && (
            <Map
              city={
                cities.find((city) => city.id.toString() === selectedCityId)
                  ?.citName || ""
              }
              province={
                provinces.find(
                  (province) => province.id.toString() === selectedProvinceId,
                )?.provinceName || ""
              }
              onLocationSelect={handleLocationSelect}
            />
          )}
        </div>
        <div className="flex w-full max-w-lg gap-4 self-end">
          <Button type="submit" className="my-3 w-full px-4 py-3">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateUserAddressForm;
