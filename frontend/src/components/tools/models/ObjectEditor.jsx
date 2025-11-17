import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";
import "./managements.css";

// ==========================================================================
// FORMULÁRIO DE TAGS
// ==========================================================================
const TagForm = ({ data, onSave, onClose, showAlert }) => {
  const [formData, setFormData] = useState({
    name: data?.name || "",
    category: data?.category || "",
    icon: data?.icon || "",
    regex: data?.regex || "",
    prompt: data?.prompt || "",
    displayCategory: data?.displayCategory || "data",
  });
  const [extractionType, setExtractionType] = useState(data?.type || "Manual");
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para ATUALIZAR o formulário se a prop 'data' mudar
  useEffect(() => {
    setFormData({
      name: data?.name || "",
      category: data?.category || "",
      icon: data?.icon || "",
      regex: data?.regex || "",
      prompt: data?.prompt || "",
      displayCategory: data?.displayCategory || "data",
    });
    setExtractionType(data?.type || "Manual");
  }, [data]);

  // Efeito para determinar o tipo de extração automaticamente
  useEffect(() => {
    // Só muda automaticamente se for uma NOVA tag
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
    setIsLoading(true);
    const payload = { ...formData, type: extractionType };

    try {
      if (data) {
        await axios.put(`/tags/${data.id}`, payload);
        showAlert("success", "Tag atualizada com sucesso!");
      } else {
        await axios.post("/tags/create", payload);
        showAlert("success", "Tag criada com sucesso!");
      }
      onSave(); // Atualiza os dados no pai
    } catch (err) {
      showAlert("error", "Erro ao salvar tag.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !data ||
      !window.confirm(`Tem certeza que deseja excluir a tag "${data.name}"?`)
    )
      return;

    setIsLoading(true);
    try {
      await axios.delete(`/tags/${data.id}`);
      showAlert("success", "Tag excluída com sucesso!");
      onSave(); // Atualiza os dados
      onClose(); // Fecha o painel
    } catch (err) {
      showAlert("error", "Erro ao excluir tag.");
    } finally {
      setIsLoading(false);
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
            value={formData.name || ""}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-field">
          <label>Categoria</label>
          <input
            type="text"
            name="category"
            value={formData.category || ""}
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
              value={formData.regex || ""}
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
              value={formData.prompt || ""}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        )}

        <div className="form-field">
          <label>Ícone</label>
          <select
            name="icon"
            value={formData.icon || ""}
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
        <div className="form-field">
          <label>Categoria de Exibição</label>
          <select
            name="displayCategory"
            value={formData.displayCategory || "data"}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="data">Dado (Caixinha)</option>
            <option value="title">Título Principal</option>
            <option value="summary">Bloco de Resumo</option>
            <option value="signatory">Signatário</option>
            <option value="list">Lista</option>
          </select>
        </div>
      </div>
      <div className="editor-footer">
        {data && (
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={isLoading}
            style={{ marginRight: "auto" }}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

// ==========================================================================
// FORMULÁRIO DE MODELOS
// ==========================================================================
const ModelForm = ({ data, onSave, onClose, showAlert, allTags }) => {
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [selectedTagIds, setSelectedTagIds] = useState(
    data?.tagsBase?.map((t) => t.id) || []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza o formulário se a prop 'data' mudar
  useEffect(() => {
    setName(data?.name || "");
    setDescription(data?.description || "");
    setSelectedTagIds(data?.tagsBase?.map((t) => t.id) || []);
  }, [data]);

  const handleTagChange = (tagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { name, description, tagIds: selectedTagIds };
    try {
      if (data) await axios.put(`/modelos/${data.id}`, payload);
      else await axios.post("/modelos", payload);
      showAlert("success", "Modelo salvo com sucesso!");
      onSave();
    } catch (err) {
      showAlert("error", "Erro ao salvar modelo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !data ||
      !window.confirm(`Tem certeza que deseja excluir o modelo "${data.name}"?`)
    )
      return;

    setIsLoading(true);
    try {
      await axios.delete(`/modelos/${data.id}`);
      showAlert("success", "Modelo excluído com sucesso!");
      onSave();
      onClose();
    } catch (err) {
      showAlert("error", "Erro ao excluir modelo.");
    } finally {
      setIsLoading(false);
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
          {allTags.map((tag) => (
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
        {data && (
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={isLoading}
            style={{ marginRight: "auto" }}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

// ==========================================================================
// FORMULÁRIO DE PASTAS
// ==========================================================================
const PastaForm = ({ data, onSave, onClose, showAlert }) => {
  const [name, setName] = useState(data?.name || "");
  const [isLoading, setIsLoading] = useState(false);

  // Atualiza o formulário se a prop 'data' mudar
  useEffect(() => {
    setName(data?.name || "");
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (data) await axios.put(`/folders/${data.id}`, { name });
      else await axios.post("/folders", { name });
      showAlert("success", "Pasta salva com sucesso!");
      onSave();
    } catch (err) {
      showAlert("error", "Erro ao salvar pasta.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !data ||
      !window.confirm(`Tem certeza que deseja excluir a pasta "${data.name}"?`)
    )
      return;

    setIsLoading(true);
    try {
      await axios.delete(`/folders/${data.id}`);
      showAlert("success", "Pasta excluída com sucesso!");
      onSave();
      onClose();
    } catch (err) {
      showAlert(
        "error",
        "Erro ao excluir pasta. Verifique se ela não contém documentos."
      );
    } finally {
      setIsLoading(false);
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
        {data && (
          <button
            type="button"
            className="btn-danger"
            onClick={handleDelete}
            disabled={isLoading}
            style={{ marginRight: "auto" }}
          >
            {isLoading ? "Excluindo..." : "Excluir"}
          </button>
        )}
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DO EDITOR (SELETOR)
// ==========================================================================
const ObjectEditor = ({ editorState, onClose, onSave, showAlert, tags }) => {
  const { type, data, mode } = editorState;
  const title = mode === "create" ? `Criar ${type}` : `Editar ${type}`;

  return (
    <div className="object-editor">
      <header className="editor-header">
        <button onClick={onClose} className="editor-back-btn">
          <Icons.ArrowRight size={20} className="back-arrow" />
          Voltar
        </button>
        <h3>{title}</h3>
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
            allTags={tags} // Passa a lista completa de tags
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
