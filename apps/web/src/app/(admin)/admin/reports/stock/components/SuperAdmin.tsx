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
import useGetStoreById from "@/hooks/api/store/useGetStoreById";
import useGetStores from "@/hooks/api/store/useGetStores";
import { format } from "date-fns";
import { debounce } from "lodash";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import ItemFilterMonth from "../../components/ItemFilterMonth";
import { replaceUnderscoreWithSpace } from "@/utils/replaceUnderscoreWithSpace";
const SuperAdmin = () => {
  const now = new Date();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [status, setStatus] = useState<string>("all");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState(`${now.getMonth() + 1}`);
  const [filterYear, setFilterYear] = useState("2024");
  const { stores } = useGetStores();
  const { store } = useGetStoreById(Number(selectedStoreId));
  const { stockJournals, isLoading, refetch, meta } =
    useGetStockJournalsByStoreWithParams({
      page,
      take: 5,
      search,
      status,
      storeId: selectedStoreId,
      filterMonth,
      filterYear,
    });
  useEffect(() => {
    setPage(1);
  }, [selectedStoreId, status, filterMonth]);
  const handleSearch = debounce((value: string) => {
    setSearch(value);
  }, 300);
  const handleStoreChange = (value: string) => {
    setSelectedStoreId(value);
  };
  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };
  const handleChangeFilterMonth = (value: string) => {
    setFilterMonth(value);
  };
  const handleChangeFilterYear = (value: string) => {
    setFilterYear(value);
  };
  const total = meta?.total || 0;
  const take = meta?.take || 10;
  if (!stockJournals) {
    return <div>Data Not Found</div>;
  }
  return (
    <main className="mx-auto max-w-6xl">
      <h2 className="mb-4 text-2xl font-bold">Stock Journal</h2>
      <div className="container border-2 bg-white pb-6 shadow-xl">
        <div className="my-4 flex justify-between">
          <div className="flex justify-between gap-4">
            <Select onValueChange={handleStoreChange} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Store</SelectItem>
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
          <div className="flex justify-between gap-4">
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="WAITING_ADMIN_CONFIRMATION">
                    WAITING ADMIN CONFIRMATION
                  </SelectItem>
                  <SelectItem value="REJECT">REJECT</SelectItem>
                  <SelectItem value="ON_PROGRESS">ON PROGRESS</SelectItem>
                  <SelectItem value="AUTOMATED">AUTOMATED</SelectItem>
                  <SelectItem value="SUCCESS">SUCCESS</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select
              name="month"
              onValueChange={handleChangeFilterMonth}
              defaultValue={`${now.getMonth() + 1}`}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={"Month"} />
              </SelectTrigger>
              <ItemFilterMonth />
            </Select>
            <Select
              name="sortYear"
              onValueChange={handleChangeFilterYear}
              defaultValue="2024"
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder={"Sort By"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
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
                      <TableCell>
                        {replaceUnderscoreWithSpace(journal.status)}
                      </TableCell>
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
                              <div className="col-span-5">
                                {journal.store.id}
                              </div>
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
                              <div className="col-span-5">
                                {journal.quantity}
                              </div>
                              <div className="col-span-5 font-semibold">
                                Type
                              </div>
                              <div className="col-span-1 text-center">:</div>
                              <div className="col-span-5">{journal.type}</div>
                              <div className="col-span-5 font-semibold">
                                Status
                              </div>
                              <div className="col-span-1 text-center">:</div>
                              <div className="col-span-5">
                                {replaceUnderscoreWithSpace(journal.status)}
                              </div>
                              <div className="col-span-5 font-semibold">
                                Date
                              </div>
                              <div className="col-span-1 text-center">:</div>
                              <div className="col-span-5">
                                {format(
                                  new Date(journal.createdAt),
                                  "yyyy-MM-dd",
                                )}
                              </div>
                              <div className="col-span-5 font-semibold">
                                Time
                              </div>
                              <div className="col-span-1 text-center">:</div>
                              <div className="col-span-5">
                                {format(
                                  new Date(journal.createdAt),
                                  "HH:mm:ss",
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
          <div className="ml-4 mt-2 flex justify-start">
            <div className="mr-10 mt-2 flex gap-4">
              <p>Total Products In Store: </p>
              <p className="font-bold">{store?.qty ?? "0"}</p>
            </div>
          </div>
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
      </div>
    </main>
  );
};
export default SuperAdmin;
