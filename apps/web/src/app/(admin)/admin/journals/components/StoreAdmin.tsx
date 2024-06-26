"use client";
import Pagination from "@/components/Pagination";
import {
  AlertDialogContent,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import useGetStockJournalByStoreAdmin from "@/hooks/api/stock-journal/useGetStockJournalByStoreAdmin";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import SearchInput from "../../products/components/Search";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StoreAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const { stockJournals, isLoading, refetch, meta } =
    useGetStockJournalByStoreAdmin({
      page,
      take: 5,
      search,
      status,
    });

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  if (!stockJournals) {
    return <div>Data Not Found</div>;
  }

  console.log(stockJournals);

  return (
    <main className="container mx-auto my-28 mb-10 max-w-4xl border-2 py-5 shadow-xl">
      <div className="mb-4 flex justify-between">
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
                          <AlertDialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will
                              permanently delete your account and remove your
                              data from our servers.
                            </DialogDescription>
                          </AlertDialogHeader>
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

export default StoreAdmin;