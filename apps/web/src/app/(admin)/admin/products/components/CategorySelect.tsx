import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface CategorySelectProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  categories: { id: number; name: string }[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  category,
  setCategory,
  categories,
}) => (
  <div className="flex items-center justify-between gap-2">
    <Filter />
    <Select
      name="category"
      onValueChange={(value) => setCategory(value)}
      value={category}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
);

export default CategorySelect;
