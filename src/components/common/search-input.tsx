// SearchInput component
const SearchInput = ({ query, onSearch }) => {
  return <input value={query} onChange={(e) => onSearch(e.target.value)} placeholder='Search...' />;
};
export default SearchInput;