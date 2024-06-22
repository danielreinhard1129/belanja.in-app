import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface SortOrderSelectProps {
  sortOrder: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
}

const SortOrderSelect: React.FC<SortOrderSelectProps> = ({
  sortOrder,
  setSortOrder,
}) => (
  <div className="flex items-center justify-between gap-2">
    <Filter />
    <Select
      name="sortOrder"
      onValueChange={(value) => setSortOrder(value)}
      value={sortOrder}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="asc">Newest</SelectItem>
          <SelectItem value="desc">Latest</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default SortOrderSelect;
