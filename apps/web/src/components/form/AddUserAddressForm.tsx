import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import useAddUserAddress from "@/hooks/api/address/useAddUserAddress";
import useGetProvinces from "@/hooks/api/address/useGetProvinces";
import useGetCities from "@/hooks/api/address/useGetCities";
import useGetSubdistricts from "@/hooks/api/address/useGetSubdistricts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormSchema } from "./AddUserAddressSchema";
import Map from "../Map";

interface AddUserAddressFormProps {
  userId: number;
}

const AddUserAddressForm: React.FC<AddUserAddressFormProps> = ({ userId }) => {
  const { addUserAddress } = useAddUserAddress(userId);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
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

  useEffect(() => {
    setSelectedCityId("");
    if (selectedProvinceId) {
      refetchCities();
    }
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedCityId) {
      refetchSubdistricts();
    }
  }, [selectedCityId]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const handleLocationSelect = (loc: any) => {
    setLocationData(loc);
  };

  const onSubmit = (values: any) => {
    if (locationData) {
      const { lat, long } = locationData;
      const dataToSubmit = { ...values, userId, lat, long };
      addUserAddress(dataToSubmit);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col px-4"
      >
        <div className="space-y-4">
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
                    defaultValue={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provincesLoading ? (
                        <div>Loading provinces...</div>
                      ) : (
                        provinces.map((province) => (
                          <SelectItem
                            key={province.id}
                            value={province.id.toString()}
                          >
                            {province.provinceName}
                          </SelectItem>
                        ))
                      )}
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
                    }}
                    defaultValue={field.value?.toString() || ""}
                    disabled={!selectedProvinceId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {citiesLoading ? (
                        <div>Loading cities...</div>
                      ) : (
                        cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.citName}
                          </SelectItem>
                        ))
                      )}
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
                      form.setValue("subdistrictId", parseInt(value));
                    }}
                    defaultValue={field.value?.toString() || ""}
                    disabled={!selectedCityId}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subdistrict" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subdistrictsLoading ? (
                        <div>Loading subdistricts...</div>
                      ) : (
                        subdistricts.map((subdistrict) => (
                          <SelectItem
                            key={subdistrict.id}
                            value={subdistrict.id.toString()}
                          >
                            {subdistrict.subdistrictName}
                          </SelectItem>
                        ))
                      )}
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
        <Button type="submit" className="my-3 w-full px-4 py-3">
          Add Address
        </Button>
      </form>
    </Form>
  );
};

export default AddUserAddressForm;
