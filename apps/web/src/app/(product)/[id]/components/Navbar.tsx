"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  return (
    <div className="container fixed z-50 bg-white flex items-center justify-between px-4 py-4">
      <Button
        variant="secondary"
        className="rounded-full p-2 hover:bg-gray-200"
        onClick={() => router.push("/")}
      >
        <ChevronLeft />
      </Button>
      <p>Product Details</p>
      <Button
        variant="secondary"
        className="rounded-full p-3 hover:bg-gray-200"
        onClick={() => router.push("/cart")}
      >
        <ShoppingBag size={20} />
      </Button>
    </div>
  );
};

export default Navbar;
