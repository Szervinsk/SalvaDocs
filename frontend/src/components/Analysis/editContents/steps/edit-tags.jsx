import { useState } from "react";
import { Icons } from "../../../../constants/icons";
import SearchBar from "../../../bars/searchBar/searchbar";
import { motion, AnimatePresence } from "framer-motion";

function EditTags({ etapas, etapaAtual, setEtapaAtual, onClose, selectedModel, selectedTags, setSelectedTags, tags }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSelectAll = () => {
    const allTagIds = filteredTags.map(tag => tag.id);
    setSelectedTags(allTagIds);
  };

  const handleClearAll = () => {
    setSelectedTags([]);
  };

  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const allSelected = filteredTags.length > 0 && filteredTags.every(tag => selectedTags.includes(tag.id));

  return (
    <div className="analysis-step-page">
      <header className="workflow-header">
        <div className="workflow-header__title">
          <Icons.Tags size={24} />
          <h2>{etapas[etapaAtual - 1].text}</h2>
        </div>
        <button className="icon-button" onClick={onClose} title="Fechar">
          <Icons.Close size={20} />
        </button>
      </header>

      <p className="page-description">
        Selecione as variáveis que você deseja extrair do modelo <b>{selectedModel?.name}</b>.
      </p>

      <div className="tag-controls">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar tags..." />
        <div className="selection-buttons">
          <button className="btn-text" onClick={handleClearAll} disabled={selectedTags.length === 0}>
            <Icons.Close size={16} />
            Limpar Seleção
          </button>
          <button className="btn-text" onClick={handleSelectAll} disabled={allSelected}>
            <Icons.Check size={16} />
            Selecionar Todas
          </button>
        </div>
      </div>

      <fieldset className="tag-grid">
        <legend className="sr-only">Lista de Tags</legend>
        <AnimatePresence>
          {filteredTags.map((tag) => (
            <motion.label
              key={tag.id}
              className={`tag-pill ${selectedTags.includes(tag.id) ? "active" : ""}`}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleChange(tag.id)}
                hidden
              />
              {selectedTags.includes(tag.id) && <Icons.Check size={14} />}
              {tag.name}
            </motion.label>
          ))}
        </AnimatePresence>
      </fieldset>

      <footer className="workflow-footer">
        <span><b>{selectedTags.length}</b> de {tags.length} tags selecionadas</span>
      </footer>
    </div>
  );
}

export default EditTags;