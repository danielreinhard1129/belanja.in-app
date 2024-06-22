"use client";
import Pagination from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import useGetProductsByFilter from "@/hooks/api/product/useGetProductsByFilter";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import SearchInput from "./Search";
import SortOrderSelect from "./SortOrderSelect";

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
  } = useGetProductsByFilter({
    page,
    take: 5,
    sortBy: "name",
    sortOrder,
    category,
    search,
  });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const router = useRouter();
  const total = meta?.total || 0;
  const take = meta?.take || 10;

  return (
    <main className="container mx-auto my-28 mb-10 max-w-4xl border-2 py-5 shadow-xl">
      <div className="my-4 flex justify-between">
        <SearchInput search={search} setSearch={setSearch} />
        <CategorySelect
          category={category}
          setCategory={setCategory}
          categories={categories}
        />
        <SortOrderSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-xs">
                Loading...
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
                      <Badge>{categories.category.name}</Badge>
                    </div>
                  ))}
                </TableCell>
                <TableCell>{product.price}</TableCell>
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
    </main>
  );
};

export default StoreAdmin;
