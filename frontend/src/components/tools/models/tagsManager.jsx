import "./EditModels.css";
import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";

// ==========================================================================
// SUB-COMPONENTE: MODAL COM FORMULÁRIO DE TAGS (Refatorado)
// ==========================================================================
const TagFormModal = ({ tag, onClose, onSave, showAlert }) => {
  const [formData, setFormData] = useState({
    name: tag?.name || "",
    category: tag?.category || "",
    icon: tag?.icon || "",
    regex: tag?.regex || "",
    prompt: tag?.prompt || "",
    displayCategory: tag?.displayCategory || "data",
  });

  // O 'type' agora é um estado separado para controle manual
  const [extractionType, setExtractionType] = useState(tag?.type || "Manual");

  const [isLoading, setIsLoading] = useState(false);

  // Efeito que determina o tipo de extração automaticamente
  useEffect(() => {
    if (formData.prompt) {
      setExtractionType("IA");
    } else if (formData.regex) {
      setExtractionType("Regex");
    } else {
      setExtractionType("Manual");
    }
  }, [formData.prompt, formData.regex]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Combina o formData com o tipo de extração final
    const payload = { ...formData, type: extractionType };

    try {
      if (tag) {
        await axios.put(`/tags/${tag.id}`, payload);
        showAlert("success", `Tag "${payload.name}" atualizada com sucesso!`);
      } else {
        await axios.post(`/tags/create`, payload);
        showAlert("success", `Tag "${payload.name}" criada com sucesso!`);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar a tag:", err);
      showAlert("error", "Erro ao salvar a tag. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="tag-form">
          <header className="modal-header">
            <h2>{tag ? "Editar Tag" : "Criar Nova Tag"}</h2>
            <button type="button" className="icon-button" onClick={onClose}><Icons.Close size={20} /></button>
          </header>

          <div className="modal-body">
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Nome da Tag</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-field">
                <label htmlFor="category">Categoria (para modelos)</label>
                <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} />
              </div>
              <div className="form-field">
                <label htmlFor="icon">Ícone</label>
                <div className="custom-select-wrapper">
                  <select id="icon" name="icon" value={formData.icon} onChange={handleInputChange}>
                    <option value="">Nenhum</option>
                    {Object.keys(Icons).map(iconName => (<option key={iconName} value={iconName}>{iconName}</option>))}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="displayCategory">Categoria de Exibição</label>
                <div className="custom-select-wrapper">
                  <select id="displayCategory" name="displayCategory" value={formData.displayCategory} onChange={handleInputChange}>
                    <option value="data">Dado (Caixinha)</option>
                    <option value="title">Título Principal</option>
                    <option value="summary">Bloco de Resumo</option>
                    <option value="signatory">Signatário</option>
                    <option value="list">Lista</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Seção de Tipo de Extração */}
            <div className="extraction-type-section">
              <label>Tipo de Extração</label>
              <div className="segmented-control">
                <button type="button" className={`segmented-control__button ${extractionType === 'Manual' ? 'active' : ''}`} onClick={() => setExtractionType('Manual')}>Manual</button>
                <button type="button" className={`segmented-control__button ${extractionType === 'Regex' ? 'active' : ''}`} onClick={() => setExtractionType('Regex')}>Regex</button>
                <button type="button" className={`segmented-control__button ${extractionType === 'IA' ? 'active' : ''}`} onClick={() => setExtractionType('IA')}>IA</button>
              </div>
            </div>

            {/* Campos Condicionais */}
            {extractionType === "Regex" && (
              <div className="form-field full-width">
                <label htmlFor="regex">Padrão Regex</label>
                <input type="text" id="regex" name="regex" value={formData.regex} onChange={handleInputChange} placeholder="Ex: /([0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2})/" />
                <p className="field-hint">O valor a ser extraído deve estar no primeiro grupo de captura `(...)`.</p>
              </div>
            )}
            {extractionType === "IA" && (
              <div className="form-field full-width">
                <label htmlFor="prompt">Prompt de IA</label>
                <textarea id="prompt" name="prompt" value={formData.prompt} onChange={handleInputChange} rows="4" placeholder="Ex: Extraia o nome completo do autor principal do documento."></textarea>
                <p className="field-hint">Descreva claramente a informação que a IA deve encontrar no texto.</p>
              </div>
            )}
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// SUB-COMPONENTE: MODAL DE CONFIRMAÇÃO PARA EXCLUIR
// ==========================================================================
const DeleteConfirmationModal = ({ tag, onClose, onConfirm, showAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/tags/${tag.id}`);
      showAlert("success", "Tag excluída com sucesso!");
      onConfirm();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir a tag:", err);
      showAlert("error", "Erro ao excluir a tag.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--small" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Confirmar Exclusão</h2>
          <button type="button" className="icon-button" onClick={onClose}><Icons.Close size={20} /></button>
        </header>
        <div className="modal-body">
          <p>Você tem certeza que deseja excluir a tag "<strong>{tag.name}</strong>"?</p>
          <p>Esta ação não pode ser desfeita.</p>
        </div>
        <footer className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>Cancelar</button>
          <button type="button" className="btn-danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </footer>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DO ARQUIVO
// ==========================================================================
const TagsManager = ({ tags, onDataChange, showAlert }) => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, currentTag: null });

  const handleOpenModal = (mode, tag = null) => setModalState({ isOpen: true, mode, currentTag: tag });
  const handleCloseModal = () => setModalState({ isOpen: false, mode: null, currentTag: null });

  const renderModal = () => {
    if (!modalState.isOpen) return null;
    if (modalState.mode === 'create' || modalState.mode === 'edit') {
      return <TagFormModal tag={modalState.currentTag} onClose={handleCloseModal} onSave={onDataChange} showAlert={showAlert} />;
    }
    if (modalState.mode === 'delete') {
      return <DeleteConfirmationModal tag={modalState.currentTag} onClose={handleCloseModal} onConfirm={onDataChange} showAlert={showAlert} />;
    }
    return null;
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gerenciamento de Tags</h2>
        <button className="btn-primary" onClick={() => handleOpenModal('create')}>
          <Icons.Add size={16} /> Criar Nova Tag
        </button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome da Tag</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Ícone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => {
              const IconComponent = tag.icon ? Icons[tag.icon] : null;
              return (
                <tr key={tag.id}>
                  <td>{tag.name}</td>
                  <td>{tag.category || "-"}</td>
                  <td><span className={`tag-type-badge type--${tag.type?.toLowerCase()}`}>{tag.type || "-"}</span></td>
                  <td>{IconComponent && <IconComponent size={18} />}</td>
                  <td className="actions-cell">
                    <button className="icon-button" title="Editar Tag" onClick={() => handleOpenModal('edit', tag)}><Icons.EditNote size={16} /></button>
                    <button className="icon-button icon-button--danger" title="Excluir Tag" onClick={() => handleOpenModal('delete', tag)}><Icons.Delete size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {renderModal()}
    </div>
  );
};

export default TagsManager;