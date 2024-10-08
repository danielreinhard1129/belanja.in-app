import CardProduct from "@/components/CardProduct";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import useGetProductsByLocation from "@/hooks/api/product/useGetProductsByLocation";
import { appConfig } from "@/utils/config";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CategoryPicker } from "./CategoryPicker";
import noproductfound from "../../../public/noproductfound.svg";
import Image from "next/image";

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
  const [category, setCategory] = useState<string>(
    searchParams.get("category") || "",
  );

  const storedLocation = localStorage.getItem("location");

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

  useEffect(() => {
    if (storedLocation) {
      const { lat, long } = JSON.parse(storedLocation);
      setLatitude(lat);
      setLongitude(long);
    }
  }, [storedLocation]);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      refetch();
    }
  }, [latitude, longitude]);

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
      const latlong = { lat: latitude, long: longitude };
      localStorage.setItem("location", JSON.stringify(latlong));
    }
  }, [latitude, longitude, page, search, category]);

  if (productsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container p-0 px-4">
      {!productsLoading ? (
        <div className="flex flex-col gap-4">
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
          {!data || data.length === 0 ? (
            <div className="flex flex-col w-full items-center gap-6 py-10">
              <div className="relative h-32 w-40">
                <Image
                  src={noproductfound}
                  alt="no product found"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-medium text-gray-400">Product not found</p>
            </div>
          ) : (
            <>
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
              <div className="mx-auto w-fit">
                <Pagination
                  total={total}
                  take={take}
                  onChangePage={handleChangePaginate}
                />
              </div>
            </>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default TodaysPick;
