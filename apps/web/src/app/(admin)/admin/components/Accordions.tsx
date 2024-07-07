import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Blocks,
  BookMarked,
  DollarSign,
  PackageSearch,
  Receipt,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const Accordions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isActiveLink = (link: string) => {
    return pathname === link ? "bg-[#FF6100] text-white" : "";
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Button
            variant="secondary"
            className={`flex w-full justify-start gap-4 border-none px-4 py-3 ${isActiveLink(
              "/admin/reports",
            )}`}
          >
            <DollarSign size={20} />
            <span>Sales & Report</span>
          </Button>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 pl-6">
          <Button
            variant="secondary"
            className={`flex w-full justify-start gap-4 border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/sales",
            )}`}
            onClick={() => router.push("/admin/reports/sales")}
          >
            <Receipt size={20} />
            <span>Sales</span>
          </Button>
          <Button
            variant="secondary"
            className={`flex w-full justify-start gap-4 border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/category",
            )}`}
            onClick={() => router.push("/admin/reports/category")}
          >
            <Blocks size={20} />
            <span>Category</span>
          </Button>
          <Button
            variant="secondary"
            className={`flex w-full justify-start gap-4 border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/product",
            )}`}
            onClick={() => router.push("/admin/reports/product")}
          >
            <PackageSearch size={20} /> <span>Product</span>
          </Button>
          <Button
            variant="secondary"
            className={`flex w-full justify-start gap-4 border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/stock",
            )}`}
            onClick={() => router.push("/admin/reports/stock")}
          >
            <BookMarked size={20} /> <span>Stock</span>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Accordions;
