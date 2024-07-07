"use client";

import CardProduct from "@/components/CardProduct";
import { useEffect, useState } from "react";
import useGetProductsByLocation from "@/hooks/api/product/useGetProductsByLocation";
import { appConfig } from "@/utils/config";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CategoryPicker } from "./CategoryPicker";

const TodaysPick = () => {
  const [page, setPage] = useState<number>(1);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") || "",
  );
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting user location: ", error);
      },
    );
  }, []);

  const {
    data,
    isLoading: productsLoading,
    meta,
    refetch,
  } = useGetProductsByLocation({
    page,
    take: 12,
    lat: Number(latitude),
    long: Number(longitude),
    search,
    category,
  });

  const total = meta?.total || 0;
  const take = meta?.take || 0;

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleSearch = debounce((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
    setSearch(value);
    setPage(1);
  }, 1500);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    replace(`${pathname}?${params.toString()}`);
    setCategory(value);
    setPage(1);
  };

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      refetch();
    }
  }, [latitude, longitude, page]);

  useEffect(() => {
    refetch();
  }, [search, category]);

  return (
    <div className="container flex flex-col gap-4 p-0 px-4">
      <div className="flex items-center gap-2">
        <svg className="h-[24px] w-[12px]">
          <rect className="h-full w-full" fill="#FF6100" />
        </svg>
        <p className="text-base font-medium">Discover Product</p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search product"
          name="search"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={search}
        />
        <CategoryPicker
          onChange={handleCategoryChange}
          defaultValue={category}
        />
      </div>
      {!productsLoading && data.length !== 0 && data ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
          {data.map((storeProduct, index) => (
            <CardProduct
              key={index}
              images={`${appConfig.baseUrl}/assets${storeProduct.product.images[0].images}`}
              discount={0}
              name={storeProduct.product.name}
              price={storeProduct.product.price}
              productId={storeProduct.product.id}
              store={storeProduct.store.City.citName}
            />
          ))}
        </div>
      ) : (
        <div>No product found</div>
      )}
      <div className="mx-auto w-fit">
        <Pagination
          total={total}
          take={take}
          onChangePage={handleChangePaginate}
        />
      </div>
    </div>
  );
};

export default TodaysPick;
