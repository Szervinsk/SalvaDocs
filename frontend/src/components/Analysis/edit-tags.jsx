import { useState, useEffect } from "react";
import { Icons } from "../../constants/icons";
import SearchBar from "../bars/searchbar";
import axios from "axios";

function EditTags({ etapas, etapaAtual, onClose, selectedModel, selectedTags, setSelectedTags, setTags, tags }) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedModel) {
      axios.get(`http://localhost:5000/api/models/${selectedModel.id}`)
        .then((res) => {
          console.log(res)
          const tagsDoModelo = res.data.tagsBase || [];
          setSelectedTags(tagsDoModelo.map((t) => t.id));

        });
    }
  }, [selectedModel, setSelectedTags]);


  const handleChange = (tagId) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };


  const filterTags = (tagsList) => {
    if (!searchQuery) return tagsList;
    return tagsList.filter((tag) =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="edit-content">
      {/* HEADER */}
      <header className="flex-left-right spc-bet">
        <div className="flex-left-right">
          <Icons.EditNote size={20} className="icons" />
          <h3>{etapas[etapaAtual - 1].text}</h3>
        </div>
        <Icons.Close size={20} className="icons" onClick={onClose} />
      </header>

      <p className="edit-p">
        Você selecionou o modelo <b>{selectedModel?.name}</b>.
      </p>

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar tags..." />

      <div className="show-edit-tags">
        {filterTags(tags).map((tag) => (
          <div
            key={tag.id}
            className="edit-tags"
            style={{
              borderColor: "var(--primary-color-grey)",
              backgroundColor: selectedTags.includes(tag.id)
                ? "var(--primary-color-grey)"
                : "var(--white)",
            }}
          >
            {selectedTags.includes(tag.id) && <Icons.Check size={15} color="#fff" />}
            <input
              type="checkbox"
              id={`tag-${tag.id}`}
              checked={selectedTags.includes(tag.id)}
              onChange={() => handleChange(tag.id)}
            />
            <label
              htmlFor={`tag-${tag.id}`}
              style={{ color: selectedTags.includes(tag.id) ? "#fff" : "var(--primary)" }}
            >
              <b>{tag.name}</b>
            </label>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 10 }}>{selectedTags.length} tags selecionadas</h3>
    </div>
  );
}

export default EditTags;
