import { Input } from "@/components/ui/input";

interface SearchInputProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, setSearch }) => (
  <Input
    type="text"
    placeholder="Search"
    name="search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
);

export default SearchInput;
