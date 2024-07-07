"use client";
import Pagination from "@/components/Pagination";
import { Input } from "@/components/ui/input";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useDeleteProduct from "@/hooks/api/product/useDeleteProduct";
import useDeleteProducts from "@/hooks/api/product/useDeleteProducts";
import useGetProductsByFilters from "@/hooks/api/product/useGetProductsByFilters";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import CategorySelect from "../CategorySelect";
import SortOrderSelect from "../SortOrderSelect";
import DeleteManyAlertDialog from "./DeleteManyAlertDialog";
import DialogCreateProduct from "./DialogCreateProduct";
import DialogSettingsCategory from "./DialogSettingsCategory";
import ProductTable from "./ProductTable";

const SuperAdmin: React.FC = () => {
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [pageCheckboxes, setPageCheckboxes] = useState<{
    [key: number]: boolean;
  }>({});
  const { categories, refetch: refetchCategories } = useGetCategories();
  const { deleteProduct, isLoading: isDeleting } = useDeleteProduct();
  const { deleteProducts, isLoading: isDeletes } = useDeleteProducts();
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

  useEffect(() => {
    setPageCheckboxes({});
    setSelectAll(false);
    setSelectedItems([]);
  }, [page]);

  useEffect(() => {
    const allSelected = products.every((product) => pageCheckboxes[product.id]);
    setSelectAll(allSelected);
  }, [products, pageCheckboxes]);

  const handleSelectOne = (id: number) => {
    const updatedPageCheckboxes = { ...pageCheckboxes };
    updatedPageCheckboxes[id] = !updatedPageCheckboxes[id];
    setPageCheckboxes(updatedPageCheckboxes);

    const selectedIndex = selectedItems.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleSelectAll = () => {
    const updatedPageCheckboxes: { [key: number]: boolean } = {};
    const updatedSelectedItems: number[] = [];
    products.forEach((product) => {
      updatedPageCheckboxes[product.id] = !selectAll;
      if (!selectAll) {
        updatedSelectedItems.push(product.id);
      }
    });
    setPageCheckboxes(updatedPageCheckboxes);
    setSelectAll(!selectAll);
    setSelectedItems(updatedSelectedItems);
  };

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    refetch();
  };

  const handleDeletes = async (productId: number[]) => {
    await deleteProducts(productId);
    refetch();
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
          <div className="ml-4 flex items-center gap-2">
            {selectedItems.length > 0 && (
              <DeleteManyAlertDialog
                handleDeletes={handleDeletes}
                isDeletes={isDeletes}
                productId={selectedItems}
              />
            )}
            <DialogSettingsCategory
              refetch={refetch}
              refetchCategories={refetchCategories}
              categories={categories}
            />
            <DialogCreateProduct refetch={refetch} categories={categories} />
          </div>
        </div>
        <ProductTable
          products={products}
          pageCheckboxes={pageCheckboxes}
          selectAll={selectAll}
          handleSelectOne={handleSelectOne}
          handleSelectAll={handleSelectAll}
          handleDelete={handleDelete}
          isLoading={isLoading}
          isDeleting={isDeleting}
          refetch={refetch}
          page={page}
          take={take}
        />
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

export default SuperAdmin;
