import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useGetProduct from "@/hooks/api/product/useGetProduct";
import { Eye } from "lucide-react";
import React from "react";
interface DialogDetailProductProps {
  productId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const DialogDetailProduct: React.FC<DialogDetailProductProps> = ({
  productId,
  open,
  onOpenChange,
}) => {
  const { product } = useGetProduct(productId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <Eye size={18} /> View Detail
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detail Product</DialogTitle>
          <DialogDescription>
            Detail product with categories and images
          </DialogDescription>
          {product?.images.map((image, index) => (
            <div key={index}>{image.images}</div>
          ))}
          {product?.categories.map((category, index) => (
            <div key={index}>{category.category.name}</div>
          ))}
          <div>{product?.name}</div>
          <div>{product?.price}</div>
          <div>{product?.weight}</div>
<<<<<<< Updated upstream
          <div>{product?.description}</div>
=======
          <div className="w-[200px] text-wrap bg-blue-200">
            {product?.description}
          </div>
>>>>>>> Stashed changes
        </DialogHeader>
        <DialogFooter className="mt-4 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2"
            variant="secondary"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogDetailProduct;
