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
      nextLabel={
        <div className="rounded-full bg-white p-1 text-[#FF6100] transition-all duration-300 hover:bg-[#FF6100] hover:text-white">
          <ChevronRight size={16} />
        </div>
      }
      previousLabel={
        <div className="rounded-full bg-white p-1 text-[#FF6100] transition-all duration-300 hover:bg-[#FF6100] hover:text-white">
          <ChevronLeft size={16} />
        </div>
      }
      pageRangeDisplayed={4}
      renderOnZeroPageCount={null}
      containerClassName="flex gap-3 justify-between w-fit m-4"
      pageLinkClassName="rounded-full py-1 px-[10px] text-sm hover:text-white transition-all duration-300 hover:bg-[#FF6100]"
      activeLinkClassName="bg-[#FF6100] text-white"
    />
  );
};

export default Pagination;
