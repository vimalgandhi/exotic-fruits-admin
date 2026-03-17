interface SearchInputProps {
  query: string;
  onSearch: (value: string) => void;
}

const SearchInput = ({ query, onSearch }: SearchInputProps) => {
  return <input value={query} onChange={(e) => onSearch(e.target.value)} placeholder='Search...' />;
};
export default SearchInput;
