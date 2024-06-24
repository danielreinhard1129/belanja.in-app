import { Input } from "@/components/ui/input";

interface SearchInputProps {
  search: string;
  setSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, setSearch }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  return (
    <Input
      type="text"
      placeholder="Search"
      name="search"
      value={search}
      onChange={handleInputChange}
    />
  );
};

export default SearchInput;
