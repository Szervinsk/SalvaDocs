import "./EditModels.css";
import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";

// ==========================================================================
// SUB-COMPONENTE: MODAL COM FORMULÁRIO DE MODELO
// ==========================================================================
const ModelFormModal = ({ model, onClose, onSave, showAlert }) => {
  const [name, setName] = useState(model?.name || "");
  const [description, setDescription] = useState(model?.description || "");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState(model?.tagsBase?.map(t => t.id) || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get("/tags")
      .then(res => setAvailableTags(res.data))
      .catch(err => {
        console.error("Erro ao buscar tags disponíveis:", err);
        showAlert("error", "Não foi possível carregar as tags.");
      });
  }, [showAlert]);

  const handleTagChange = (tagId) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { name, description, tagIds: selectedTagIds };
    try {
      if (model) {
        await axios.put(`/modelos/${model.id}`, payload);
        showAlert("success", `Modelo "${name}" atualizado com sucesso!`);
      } else {
        await axios.post(`/modelos`, payload); // Rota REST
        showAlert("success", `Modelo "${name}" criado com sucesso!`);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar o modelo:", err);
      showAlert("error", "Erro ao salvar o modelo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="tag-form">
          <header className="modal-header">
            <h2>{model ? "Editar Modelo" : "Criar Novo Modelo"}</h2>
            <button type="button" className="icon-button" onClick={onClose}><Icons.Close size={20} /></button>
          </header>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="name">Nome do Modelo</label>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-field">
              <label htmlFor="description">Descrição (Opcional)</label>
              <input type="text" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Tags Associadas</label>
              <div className="tag-selection-grid">
                {availableTags.length > 0 ? availableTags.map(tag => (
                  <label key={tag.id} className={`tag-pill ${selectedTagIds.includes(tag.id) ? "active" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => handleTagChange(tag.id)}
                      hidden
                    />
                    {selectedTagIds.includes(tag.id) && <Icons.Check size={14} />}
                    {tag.name}
                  </label>
                )) : <p className="empty-text">Nenhuma tag cadastrada.</p>}
              </div>
            </div>
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
const DeleteConfirmationModal = ({ model, onClose, onConfirm, showAlert }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/modelos/${model.id}`);
      showAlert("success", `Modelo "${model.name}" excluído com sucesso.`);
      onConfirm();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir o modelo:", err);
      showAlert("error", "Erro ao excluir o modelo.");
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
          <p>Você tem certeza que deseja excluir o modelo "<strong>{model.name}</strong>"?</p>
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
const ModelsManager = ({ modelos, onDataChange, showAlert }) => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, currentModel: null });

  const handleOpenModal = (mode, model = null) => setModalState({ isOpen: true, mode, currentModel: model });
  const handleCloseModal = () => setModalState({ isOpen: false, mode: null, currentModel: null });

  const renderModal = () => {
    if (!modalState.isOpen) return null;
    if (modalState.mode === 'create' || modalState.mode === 'edit') {
      return <ModelFormModal model={modalState.currentModel} onClose={handleCloseModal} onSave={onDataChange} showAlert={showAlert} />;
    }
    if (modalState.mode === 'delete') {
      return <DeleteConfirmationModal model={modalState.currentModel} onClose={handleCloseModal} onConfirm={onDataChange} showAlert={showAlert} />;
    }
    return null;
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gerenciamento de Modelos</h2>
        <button className="btn-primary" onClick={() => handleOpenModal('create')}>
          <Icons.Add size={16} /> Criar Novo Modelo
        </button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome do Modelo</th>
              <th>Tags Associadas</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {modelos.map((modelo) => (
              <tr key={modelo.id}>
                <td>{modelo.name}</td>
                <td><span className="tag-count">{modelo.tagsBase?.length || 0}</span></td>
                <td className="actions-cell">
                  <button className="icon-button" title="Editar Modelo" onClick={() => handleOpenModal('edit', modelo)}><Icons.EditNote size={16} /></button>
                  <button className="icon-button icon-button--danger" title="Excluir Modelo" onClick={() => handleOpenModal('delete', modelo)}><Icons.Delete size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderModal()}
    </div>
  );
};

export default ModelsManager;