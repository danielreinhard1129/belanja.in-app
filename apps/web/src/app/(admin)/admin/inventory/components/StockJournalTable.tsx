import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface StockJournalTableProps {
  filteredStockJournals: any;
  takeStockJournal: number;
  handleChangePaginateStockJournal: ({
    selected,
  }: {
    selected: number;
  }) => void;
  totalStockJournal: number;
}

const StockJournalTable: React.FC<StockJournalTableProps> = ({
  filteredStockJournals,
  takeStockJournal,
  handleChangePaginateStockJournal,
  totalStockJournal,
}) => {
  return (
    <main>
      <h3 className="mb-4 mt-10 text-xl font-bold">Stock Journal</h3>
      <div className="my-4 mb-10 border-2 p-5 shadow-xl">
        <Table>
          <TableCaption>A list of your Journey.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Form Store</TableHead>
              <TableHead>Quantity Product</TableHead>
              <TableHead>To Store</TableHead>
              <TableHead>Quantity Product</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStockJournals && filteredStockJournals.length > 0 ? (
              filteredStockJournals.map((data: any, ijournal: any) => (
                <TableRow key={ijournal}>
                  <TableCell className="font-medium">{ijournal + 1}</TableCell>
                  <TableCell>{data.productId}</TableCell>
                  <TableCell>{data.storeId}</TableCell>
                  <TableCell>{data.quantity}</TableCell>
                  {data.JournalDetail.map((journalDetail: any) => (
                    <React.Fragment key={journalDetail.id}>
                      <TableCell>
                        {journalDetail.toStoreId}-
                        {journalDetail.toStore
                          ? journalDetail.toStore.name
                          : "Store not found"}
                      </TableCell>
                    </React.Fragment>
                  ))}
                  <TableCell>{data.type}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="border-b px-4 py-2 text-center"
                >
                  Data Not Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="mx-auto w-fit">
          <Pagination
            total={totalStockJournal}
            take={takeStockJournal}
            onChangePage={handleChangePaginateStockJournal}
          />
        </div>
      </div>
    </main>
  );
};

export default StockJournalTable;
