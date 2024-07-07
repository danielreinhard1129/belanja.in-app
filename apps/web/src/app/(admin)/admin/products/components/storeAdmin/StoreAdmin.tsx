"use client";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useGetProductsByFilters from "@/hooks/api/product/useGetProductsByFilters";
import { formatToRupiah } from "@/utils/formatCurrency";
import { formatWeight } from "@/utils/formatWeight";
import { debounce } from "lodash";
import { Eye, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import CategorySelect from "../CategorySelect";
import SortOrderSelect from "../SortOrderSelect";

const StoreAdmin: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const { categories } = useGetCategories();
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const {
    data: products,
    isLoading,
    meta,
    refetch,
  } = useGetProductsByFilters({
    page,
    take: 5,
    sortBy: "name",
    sortOrder,
    category,
    search,
  });

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 300);

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  return (
    <main className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-2xl font-bold">Products</h2>
      <div className="container border-2 bg-white pb-6 shadow-xl">
        <div className="my-4 flex justify-between">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search"
              name="search"
              onChange={(e) => {
                handleSearch(e.target.value);
              }}
            />
            <CategorySelect
              category={category}
              setCategory={setCategory}
              categories={categories}
            />
            <SortOrderSelect
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-xs">
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-xs">
                  Data Not Found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {(page - 1) * take + index + 1}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <span>
                          <Button variant="outline">
                            <ImageIcon />
                          </Button>
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="h-auto w-[200px]">
                        {product.images?.map((image: any, imgIndex: number) => (
                          <div className="flex" key={imgIndex}>
                            <Image
                              src={`http://localhost:8000/api/assets${image.images}`}
                              alt={`${product.name} image ${imgIndex + 1}`}
                              width={200}
                              height={200}
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.categories.map((categories: any, cti: any) => (
                      <div className="my-1" key={cti}>
                        <div className="inline-block rounded-full bg-orange-300 px-2 py-1 text-orange-800">
                          {categories.category.name}
                        </div>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{formatToRupiah(product.price)}</TableCell>
                  <TableCell>{formatWeight(product.weight)}</TableCell>
                  <TableCell>
                    <Link href={`/admin/products/${product.id}`}>
                      <div className="flex cursor-pointer items-center gap-2">
                        <Eye size={16} /> View Detail
                      </div>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mx-auto w-fit">
          <Pagination
            total={total}
            take={take}
            onChangePage={handleChangePaginate}
          />
        </div>
      </div>
    </main>
  );
};

export default StoreAdmin;
