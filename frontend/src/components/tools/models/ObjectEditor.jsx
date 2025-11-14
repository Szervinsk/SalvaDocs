import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";
import "./managements.css";

// --- FORMULÁRIO DE TAGS ---
const TagForm = ({ data, onSave, onClose, showAlert }) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    category: data?.category || "",
    type: data?.type || "Manual",
    icon: data?.icon || "",
    regex: data?.regex || "",
    prompt: data?.prompt || "",
    displayCategory: data?.displayCategory || "data",
  });
  const [extractionType, setExtractionType] = useState(data?.type || "Manual");

  useEffect(() => {
    if (!data) {
      if (formData.prompt) setExtractionType("IA");
      else if (formData.regex) setExtractionType("Regex");
      else setExtractionType("Manual");
    }
  }, [formData.prompt, formData.regex, data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, type: extractionType };
    try {
      if (data) await axios.put(`/tags/${data.id}`, payload);
      else await axios.post("/tags", payload);
      showAlert("success", "Tag salva com sucesso!");
      onSave();
    } catch (err) {
      showAlert("error", "Erro ao salvar tag.");
    }
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label>Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Categoria</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-field full-width">
          <label>Tipo de Extração</label>
          <div className="segmented-control">
            <button
              type="button"
              className={`segmented-control__button ${
                extractionType === "Manual" ? "active" : ""
              }`}
              onClick={() => setExtractionType("Manual")}
            >
              Manual
            </button>
            <button
              type="button"
              className={`segmented-control__button ${
                extractionType === "Regex" ? "active" : ""
              }`}
              onClick={() => setExtractionType("Regex")}
            >
              Regex
            </button>
            <button
              type="button"
              className={`segmented-control__button ${
                extractionType === "IA" ? "active" : ""
              }`}
              onClick={() => setExtractionType("IA")}
            >
              IA
            </button>
          </div>
        </div>

        {extractionType === "Regex" && (
          <div className="form-field full-width">
            <label>Regex</label>
            <input
              type="text"
              name="regex"
              value={formData.regex}
              onChange={handleInputChange}
              placeholder="/.../"
            />
          </div>
        )}
        {extractionType === "IA" && (
          <div className="form-field full-width">
            <label>Prompt IA</label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        )}

        <div className="form-field full-width">
          <label>Ícone</label>
          <select
            name="icon"
            value={formData.icon}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="">Nenhum</option>
            {Object.keys(Icons).map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="editor-footer">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
};

// --- FORMULÁRIO DE MODELOS (O que você mandou) ---
const ModelForm = ({ data, onSave, onClose, showAlert }) => {
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(
    data?.tagsBase?.map((t) => t.id) || []
  );

  useEffect(() => {
    axios.get("/tags").then((res) => setAvailableTags(res.data));
  }, []);

  const handleTagChange = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name, description, tagIds: selectedTagIds };
    try {
      if (data) await axios.put(`/modelos/${data.id}`, payload);
      else await axios.post("/modelos", payload);
      showAlert("success", "Modelo salvo com sucesso!");
      onSave();
    } catch (err) {
      showAlert("error", "Erro ao salvar modelo.");
    }
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nome do Modelo</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-field">
        <label>Descrição</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-field">
        <label>Tags Associadas</label>
        <div className="tag-selection-grid">
          {availableTags.map((tag) => (
            <label
              key={tag.id}
              className={`tag-pill ${
                selectedTagIds.includes(tag.id) ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selectedTagIds.includes(tag.id)}
                onChange={() => handleTagChange(tag.id)}
                hidden
              />
              {selectedTagIds.includes(tag.id) && <Icons.Check size={14} />}
              {tag.name}
            </label>
          ))}
        </div>
      </div>
      <div className="editor-footer">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
};

// --- FORMULÁRIO DE PASTAS ---
const PastaForm = ({ data, onSave, onClose, showAlert }) => {
  const [name, setName] = useState(data?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data) await axios.put(`/folders/${data.id}`, { name });
      else await axios.post("/folders", { name });
      showAlert("success", "Pasta salva com sucesso!");
      onSave();
    } catch (err) {
      showAlert("error", "Erro ao salvar pasta.");
    }
  };

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nome da Pasta</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="editor-footer">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
};

// --- COMPONENTE PRINCIPAL DO EDITOR (SELETOR) ---
const ObjectEditor = ({ editorState, onClose, onSave, showAlert }) => {
  const { type, data, mode } = editorState;
  const title = mode === "create" ? `Criar ${type}` : `Editar ${type}`;

  return (
    <div className="object-editor">
      <header className="editor-header">
        <h3>{title}</h3>
        <button className="icon-btn" onClick={onClose}>
          <Icons.Close size={20} />
        </button>
      </header>
      <div className="editor-body">
        {type === "tag" && (
          <TagForm
            data={data}
            onSave={onSave}
            onClose={onClose}
            showAlert={showAlert}
          />
        )}
        {type === "modelo" && (
          <ModelForm
            data={data}
            onSave={onSave}
            onClose={onClose}
            showAlert={showAlert}
          />
        )}
        {type === "pasta" && (
          <PastaForm
            data={data}
            onSave={onSave}
            onClose={onClose}
            showAlert={showAlert}
          />
        )}
      </div>
    </div>
  );
};

export default ObjectEditor;
