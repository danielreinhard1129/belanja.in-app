"use client";
import { format } from "date-fns";
import useGetStores from "@/hooks/api/store/useGetStores";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import useGetStockJournalsByStoreWithParams from "@/hooks/api/stock-journal/useGetStockJournalsByStoreWithParams";
import Pagination from "@/components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import SearchInput from "../../products/components/Search";

const SuperAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
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
    // Reset page to 1 whenever storeId changes
    setPage(1);
  }, [selectedStoreId]);

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
    <main className="container mx-auto my-28 mb-10 max-w-4xl border-2 py-5 shadow-xl">
      <div className="flex justify-between">
        <div>
          <Select onValueChange={handleStoreChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select store" />
            </SelectTrigger>
            <SelectContent>
              {stores.map((store) => (
                <SelectItem key={store.id} value={String(store.id)}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-[300px]">
            <SearchInput search={search} setSearch={setSearch} />
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
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
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
                            <div className="col-span-5 font-semibold">
                              CreatedAt
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {format(
                                new Date(journal.createdAt),
                                "yyyy-MM-dd HH:mm:ss",
                              )}
                            </div>
                            <div className="col-span-5 font-semibold">
                              UpdatedAt
                            </div>
                            <div className="col-span-1 text-center">:</div>
                            <div className="col-span-5">
                              {format(
                                new Date(journal.updatedAt),
                                "yyyy-MM-dd HH:mm:ss",
                              )}
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
