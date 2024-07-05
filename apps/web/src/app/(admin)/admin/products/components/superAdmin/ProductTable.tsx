import { Button } from "@/components/ui/button";
import { formatToRupiah } from "@/utils/formatCurrency";
import { formatWeight } from "@/utils/formatWeight";
import { Checkbox } from "@/components/ui/checkbox";
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
import { BASE_API_URL } from "@/utils/config";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import PopoverProductMenu from "./PopoverProductMenu";

interface ProductTableProps {
  products: any[];
  pageCheckboxes: { [key: number]: boolean };
  selectAll: boolean;
  handleSelectOne: (id: number) => void;
  handleSelectAll: () => void;
  handleDelete: (id: number) => void;
  refetch: () => void;
  isLoading: boolean;
  isDeleting: boolean;
  page: number;
  take: number;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  pageCheckboxes,
  selectAll,
  handleSelectOne,
  handleSelectAll,
  handleDelete,
  isLoading,
  isDeleting,
  refetch,
  page,
  take,
}) => {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Checkbox
              checked={selectAll}
              onCheckedChange={(value) => {
                handleSelectAll();
              }}
              aria-label="Select All"
            />
          </TableHead>
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
            <TableCell colSpan={8} className="text-center text-xs">
              Loading...
            </TableCell>
          </TableRow>
        ) : products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-xs">
              Data not found
            </TableCell>
          </TableRow>
        ) : (
          products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={pageCheckboxes[product.id] || false}
                  onCheckedChange={() => handleSelectOne(product.id)}
                />
              </TableCell>
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
                          src={`${BASE_API_URL}/assets${image.images}`}
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
                    <div className="inline-block rounded-full bg-slate-300 px-2 py-1 text-black">
                      {categories.category.name}
                    </div>
                  </div>
                ))}
              </TableCell>
              <TableCell>{formatToRupiah(product.price)}</TableCell>
              <TableCell>{formatWeight(product.weight)}</TableCell>
              <TableCell>
                <PopoverProductMenu
                  productId={product.id}
                  isDeleting={isDeleting}
                  handleDelete={handleDelete}
                  refetch={refetch}
                />
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
