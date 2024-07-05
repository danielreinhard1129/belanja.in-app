"use client";
import Pagination from "@/components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetStockJournalsByStoreWithParams from "@/hooks/api/stock-journal/useGetStockJournalsByStoreWithParams";
import useGetStores from "@/hooks/api/store/useGetStores";
import { format } from "date-fns";
import { debounce } from "lodash";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const SuperAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("all");
  const { stores } = useGetStores();
  const { stockJournals, isLoading, refetch, meta } =
    useGetStockJournalsByStoreWithParams({
      page,
      take: 5,
      search,
      status,
      storeId: selectedStoreId,
    });

  useEffect(() => {
    setPage(1);
  }, [selectedStoreId]);

  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 300);

  const handleStoreChange = (value: string) => {
    setSelectedStoreId(value);
  };

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  if (!stockJournals) {
    return <div>Data Not Found</div>;
  }

  // console.log(stockJournals);

  return (
    <main className="container mx-auto mb-10 max-w-6xl border-2 pb-6 shadow-xl">
      <div className="my-4 flex justify-between">
        <div className="flex justify-between gap-4">
          <Select onValueChange={handleStoreChange} defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            placeholder="Search"
            name="search"
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
          />
        </div>
        <div>
          <Select onValueChange={(value) => setStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="WAITING_ADMIN_CONFIRMATION">
                  WAITING_ADMIN_CONFIRMATION
                </SelectItem>
                <SelectItem value="REJECT">REJECT</SelectItem>
                <SelectItem value="SUCCESS">SUCCESS</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>From Store</TableHead>
              <TableHead>To Store</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stockJournals.length > 0 ? (
              stockJournals.map((journal, index) =>
                journal.JournalDetail.map((journalDetail, i) => (
                  <TableRow key={`${journal.id}-${i}`}>
                    <TableCell className="font-medium">
                      {(page - 1) * take + index + 1}
                    </TableCell>
                    <TableCell>{journal.product.name}</TableCell>
                    <TableCell>{journal.store.name}</TableCell>
                    <TableCell>
                      {journalDetail.toStore?.name ?? "Not Found"}
                    </TableCell>
                    <TableCell>{journal.quantity}</TableCell>
                    <TableCell>{journal.type}</TableCell>
                    <TableCell>{journal.status}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex cursor-pointer items-center gap-2">
                                  <Eye size={20} />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>View Detail</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Stock Journal Detail</DialogTitle>
                            <DialogDescription>
                              Details of the stock journal.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid w-full grid-cols-11">
                            <div className="col-span-5 font-semibold">
                              From Store
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {journal.store.name}
                            </div>
                            <div className="col-span-5 font-semibold">
                              Store ID
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">{journal.store.id}</div>
                            <div className="col-span-5 font-semibold">
                              To Store
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {journalDetail.toStore?.name ?? "Not Found"}
                            </div>
                            <div className="col-span-5 font-semibold">
                              Store ID
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {journalDetail.toStore?.id ?? "Not Found"}
                            </div>
                            <div className="col-span-5 font-semibold">
                              Product Name
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {journal.product.name}
                            </div>
                            <div className="col-span-5 font-semibold">
                              Product ID
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {journal.product.id}
                            </div>
                            <div className="col-span-5 font-semibold">
                              Quantity
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">{journal.quantity}</div>
                            <div className="col-span-5 font-semibold">Type</div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">{journal.type}</div>
                            <div className="col-span-5 font-semibold">
                              Status
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">{journal.status}</div>
                            <div className="col-span-5 font-semibold">Date</div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {format(
                                new Date(journal.createdAt),
                                "yyyy-MM-dd",
                              )}
                            </div>
                            <div className="col-span-5 font-semibold">Time</div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {format(new Date(journal.createdAt), "HH:mm:ss")}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )),
              )
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No stock journals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {stockJournals.length > 0 && (
          <div className="mx-auto w-fit">
            <Pagination
              total={total}
              take={take}
              onChangePage={handleChangePaginate}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default SuperAdmin;
