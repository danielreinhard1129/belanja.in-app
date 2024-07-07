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
import Link from "next/link";
import { usePathname } from "next/navigation";

const Accordions = () => {
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
            className={`w-full justify-start border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/sales",
            )}`}
          >
            <Link href="/admin/reports/sales" className="flex gap-4">
              <Receipt size={20} />
              <span>Sales</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            className={`w-full justify-start border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/category",
            )}`}
          >
            <Link href="/admin/reports/category" className="flex gap-4">
              <Blocks size={20} />
              <span>Category</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            className={`w-full justify-start border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/product",
            )}`}
          >
            <Link href="/admin/reports/product" className="flex gap-4">
              <PackageSearch size={20} /> <span>Product</span>
            </Link>
          </Button>
          <Button
            variant="secondary"
            className={`w-full justify-start border-none px-4 py-3 ${isActiveLink(
              "/admin/reports/stock",
            )}`}
          >
            <Link href="/admin/reports/stock" className="flex gap-4">
              <BookMarked size={20} /> <span>Stock</span>
            </Link>
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Accordions;
