import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
import useGetStockJournalByStoreAdmin from "@/hooks/api/stock-journal/useGetStockJournalByStoreAdmin";
import useArriveStockMutation from "@/hooks/api/store-product/useArriveStockMutation";
import useConfirmStockMutation from "@/hooks/api/store-product/useConfirmStockMutation";
import useRejectStockMutation from "@/hooks/api/store-product/useRejectStockMutation";
import { format } from "date-fns";
import { Eye, Loader2, NotebookPen } from "lucide-react";
import React, { useState } from "react";

interface DialogStockActionStoreAdminProps {
  storeId: number;
  refetch: () => void;
}

const DialogStockActionStoreAdmin: React.FC<
  DialogStockActionStoreAdminProps
> = ({ storeId, refetch }) => {
  const [page, setPage] = useState<number>(1);
  const [status, setStatus] = useState<string>("WAITING_ADMIN_CONFIRMATION");
  const {
    stockJournals,
    isLoading,
    refetch: refetchStockJournals,
    meta,
  } = useGetStockJournalByStoreAdmin({
    page,
    take: 5,
    status,
  });
  const { confirmMutation, isLoading: isConfirm } = useConfirmStockMutation();
  const { rejectMutation, isLoading: isReject } = useRejectStockMutation();
  const { arriveMutation, isLoading: isArrive } = useArriveStockMutation();

  const handleChangePaginate = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleConfirm = async (id: number) => {
    await confirmMutation(id);
    refetchStockJournals();
    refetch();
  };

  const handleReject = async (id: number) => {
    await rejectMutation(id);
    refetchStockJournals();
    refetch();
  };

  const handleArrive = async (id: number) => {
    await arriveMutation(id);
    refetchStockJournals();
    refetch();
  };

  const total = meta?.total || 0;
  const take = meta?.take || 10;

  if (!stockJournals) {
    return <div>Data Not Found</div>;
  }

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4" />
          <span>Stock</span>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-6">
          <div className="mb-4">
            <Select
              onValueChange={(value) => setStatus(value)}
              defaultValue="WAITING_ADMIN_CONFIRMATION"
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="WAITING_ADMIN_CONFIRMATION">
                    WAITING_ADMIN_CONFIRMATION
                  </SelectItem>
                  <SelectItem value="ON_PROGRESS">ON_PROGRESS</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
                            <div className="mt-4 flex justify-center gap-2">
                              {storeId === journalDetail.toStoreId &&
                              journal.status ===
                                "WAITING_ADMIN_CONFIRMATION" ? (
                                <>
                                  <Button
                                    disabled={isReject}
                                    onClick={() => handleReject(journal.id)}
                                    className="bg-red-500 px-4 py-2 hover:bg-red-600"
                                  >
                                    {isReject ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Reject
                                  </Button>
                                  <Button
                                    disabled={isConfirm}
                                    onClick={() => handleConfirm(journal.id)}
                                    className="bg-green-500 px-4 py-2 hover:bg-green-600"
                                  >
                                    {isConfirm ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : null}
                                    Confirm
                                  </Button>
                                </>
                              ) : storeId === journal.fromStoreId &&
                                journal.status === "ON_PROGRESS" ? (
                                <Button
                                  disabled={isArrive}
                                  onClick={() => handleArrive(journal.id)}
                                  className="bg-blue-500 px-4 py-2 hover:bg-blue-600"
                                >
                                  {isArrive ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  Arrive
                                </Button>
                              ) : null}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )),
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Data Not Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center py-4">
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
      </DrawerContent>
    </Drawer>
  );
};

export default DialogStockActionStoreAdmin;
