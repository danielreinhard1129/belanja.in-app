"use client";
import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useGetStockJournalByStore from "@/hooks/api/stock-journal/useGetStockJournalByStore";
import React, { useState } from "react";

const StoreAdmin = () => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const { stockJournals, isLoading, refetch, meta } = useGetStockJournalByStore(
    {
      page,
      take: 5,
      search,
    },
  );

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
            {stockJournals && stockJournals.length > 0 ? (
              stockJournals.map((journal, index) => (
                <TableRow key={journal.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{journal.product.name}</TableCell>
                  <TableCell>{journal.store.name}</TableCell>
                  <TableCell>
                    {journal.JournalDetail.map((journalDetail, i) => (
                      <React.Fragment key={i}>
                        {journalDetail.toStore.name}
                      </React.Fragment>
                    ))}
                  </TableCell>
                  <TableCell>{journal.quantity}</TableCell>
                  <TableCell>{journal.type}</TableCell>
                  <TableCell>{journal.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No stock journals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mx-auto w-fit">
          <Pagination
            total={total}
            take={take}
            onChangePage={handleChangePaginate}
          />
        </div>
      </div>
    </main>
  );
};

export default StoreAdmin;
