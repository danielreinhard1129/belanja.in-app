"use client";
import Pagination from "@/components/Pagination";
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useDeleteProduct from "@/hooks/api/product/useDeleteProduct";
import useDeleteProducts from "@/hooks/api/product/useDeleteProducts";
import useGetProductsByFilter from "@/hooks/api/product/useGetProductsByFilter";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CategorySelect from "./CategorySelect";
import DeleteManyAlertDialog from "./DeleteManyAlertDialog";
import DialogCreateProduct from "./DialogCreateProduct";
import ProductTable from "./ProductTable";
import SearchInput from "./Search";
import SortOrderSelect from "./SortOrderSelect";

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
  const { categories } = useGetCategories();
  const { deleteProduct, isLoading: isDeleting } = useDeleteProduct();
  const { deleteProducts, isLoading: isDeletes } = useDeleteProducts();
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
  useEffect(() => {
    // Reset pageCheckboxes when page changes
    setPageCheckboxes({});
    setSelectAll(false);
    setSelectedItems([]); // Reset selected items
  }, [page]);

  useEffect(() => {
    // Check if all products on the current page are selected
    const allSelected = products.every((product) => pageCheckboxes[product.id]);
    setSelectAll(allSelected);
  }, [products, pageCheckboxes]);

  const handleSelectOne = (id: number) => {
    const updatedPageCheckboxes = { ...pageCheckboxes };
    updatedPageCheckboxes[id] = !updatedPageCheckboxes[id];
    setPageCheckboxes(updatedPageCheckboxes);

    // Update selected items
    const selectedIndex = selectedItems.indexOf(id);
    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, id]); // Add to selected items
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id)); // Remove from selected items
    }
  };

  const handleSelectAll = () => {
    const updatedPageCheckboxes: { [key: number]: boolean } = {};
    const updatedSelectedItems: number[] = [];
    products.forEach((product) => {
      updatedPageCheckboxes[product.id] = !selectAll;
      if (!selectAll) {
        updatedSelectedItems.push(product.id); // Add to selected items
      }
    });
    setPageCheckboxes(updatedPageCheckboxes);
    setSelectAll(!selectAll);
    setSelectedItems(updatedSelectedItems); // Update selected items
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

  const router = useRouter();
  const total = meta?.total || 0;
  const take = meta?.take || 10;

  return (
    <main className="container mx-auto mb-10 max-w-4xl border-2 shadow-xl">
      <div className="my-4 flex justify-between">
        <div className="flex gap-4">
          <SearchInput search={search} setSearch={setSearch} />
          <CategorySelect
            category={category}
            setCategory={setCategory}
            categories={categories}
          />
          <SortOrderSelect sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
        <div className="ml-4 flex gap-2">
          {selectedItems.length > 0 && (
            <DeleteManyAlertDialog
              handleDeletes={handleDeletes}
              isDeletes={isDeletes}
              productId={selectedItems}
            />
          )}
          <DialogCreateProduct refetch={refetch} />
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
    </main>
  );
};

export default SuperAdmin;
