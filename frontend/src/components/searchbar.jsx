import { MdOutlineSearch } from "react-icons/md";

function SearchBar({ searchQuery, setSearchQuery }) {
  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <MdOutlineSearch size={20} className="search-icon" />
      <input
        type="text"
        placeholder="Pesquise suas pastas"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        className="search-input"
      />
    </form>
  );
}

export default SearchBar;
