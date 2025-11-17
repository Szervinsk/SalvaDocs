import { Icons } from "../../../constants/icons";
import "./searchbar.css"; // Certifique-se que o CSS está sendo importado

function SearchBar({ searchQuery, setSearchQuery, placeholder, suggestion, onKeyDown }) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-bar-icon">
        <Icons.Search size={16} />
      </div>

      {suggestion && (
        <div className="search-bar-suggestion">
          {/* Renderiza a parte já digitada com 'visibility: hidden' para alinhar a sugestão */}
          <span style={{ visibility: 'hidden' }}>{searchQuery}</span>
          <span>{suggestion}</span>
        </div>
      )}

      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder || "Buscar..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={onKeyDown} // Adiciona o listener de keydown
      />

      {/* Botão de limpar (opcional) */}
      {searchQuery && (
        <button className="search-bar-clear" onClick={() => setSearchQuery("")}>
          <Icons.Close size={14} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;