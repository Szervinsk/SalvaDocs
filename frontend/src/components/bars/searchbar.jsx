import { Icons } from "../../constants/icons";

function SearchBar({ searchQuery, setSearchQuery, placeholder }) {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <Icons.Search size={20} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder} // colocar if para se for das pastas ou se for dos tools
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        className="search-input"
      />
    </form>
  );
}

export default SearchBar;
