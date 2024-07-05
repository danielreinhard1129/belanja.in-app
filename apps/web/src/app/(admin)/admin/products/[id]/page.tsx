"use client";
import Image from "next/image";
import React from "react";
import ImageDataNotFound from "../../../../../../public/no-store.svg";
import useGetProduct from "@/hooks/api/product/useGetProduct";

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const { product } = useGetProduct(Number(params.id));
  if (!product) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-7">
        <div className="text-center text-xl font-bold">Data Not Found</div>
        <div>
          <Image
            src={ImageDataNotFound}
            alt="ImageDataNotFound"
            width={600}
            height={600}
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </div>
      </div>
    );
  }
  return (
    <main className="container mx-auto my-auto max-w-6xl border-2 p-8 shadow-xl">
      <div className="mx-auto my-auto flex items-center justify-between">
        <div></div>
      </div>
    </main>
  );
};

export default ProductDetail;
