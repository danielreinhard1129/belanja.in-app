import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC } from "react";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  total: number;
  take: number;
  onChangePage: ({ selected }: { selected: number }) => void;
}

const Pagination: FC<PaginationProps> = ({ onChangePage, total, take }) => {
  return (
    <ReactPaginate
      onPageChange={onChangePage}
      pageCount={Math.ceil(total / take)}
      nextLabel={<ChevronRight />}
      previousLabel={<ChevronLeft />}
      pageRangeDisplayed={4}
      renderOnZeroPageCount={null}
      containerClassName="flex gap-4 w-fit m-4"
      pageLinkClassName="p-2 rounded-lg"
      activeLinkClassName="bg-black text-white"
    />
  );
};

export default Pagination;
