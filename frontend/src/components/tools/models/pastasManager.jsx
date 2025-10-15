import "./EditModels.css";
import { useState } from "react";
import { Icons } from "../../../constants/icons";
import axios from "axios";

// --- Sub-componente: Modal de Formulário de Pasta ---
const PastaFormModal = ({ pasta, onClose, onSave, showAlert , baseURL}) => {
  const [name, setName] = useState(pasta?.name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (pasta) {
        await axios.put(`${baseURL}/folders/${pasta.id}`, { name });
        showAlert("success", `Pasta "${name}" editada com sucesso!`);
      } else {
        await axios.post(`${baseURL}/folders`, { name });
        showAlert("success", "Pasta criada com sucesso!");
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao salvar a pasta:", err);
      showAlert("error", "Erro ao salvar a pasta.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="tag-form">
          <header className="modal-header">
            <h2>{pasta ? "Editar Pasta" : "Criar Nova Pasta"}</h2>
            <button type="button" className="icon-button" onClick={onClose}><Icons.Close size={20} /></button>
          </header>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="name">Nome da Pasta</label>
              <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <footer className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-primary">Salvar</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

// --- Sub-componente: Modal de Confirmação para Excluir ---
const DeleteConfirmationModal = ({ pasta, onClose, onConfirm, showAlert, baseURL }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${baseURL}/folders/${pasta.id}`);
      showAlert("success", "Pasta excluída com sucesso!");
      onConfirm();
      onClose();
    } catch (err) {
      console.error("Erro ao excluir a pasta:", err);
      showAlert("error", "Erro ao excluir a pasta.");
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
          <p>Você tem certeza que deseja excluir a pasta "<strong>{pasta.name}</strong>"?</p>
        </div>
        <footer className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-danger" onClick={handleDelete}>Sim, Excluir</button>
        </footer>
      </div>
    </div>
  );
};


// --- Componente Principal do Arquivo ---
const PastasManager = ({ pastas, onDataChange, showAlert, baseURL }) => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, currentPasta: null });

  const handleOpenModal = (mode, pasta = null) => setModalState({ isOpen: true, mode, currentPasta: pasta });
  const handleCloseModal = () => setModalState({ isOpen: false, mode: null, currentPasta: null });

  const renderModal = () => {
    if (!modalState.isOpen) return null;
    if (modalState.mode === 'create' || modalState.mode === 'edit') {
      return <PastaFormModal pasta={modalState.currentPasta} onClose={handleCloseModal} onSave={onDataChange} showAlert={showAlert} baseURL={baseURL} />;
    }
    if (modalState.mode === 'delete') {
      return <DeleteConfirmationModal pasta={modalState.currentPasta} onClose={handleCloseModal} onConfirm={onDataChange} showAlert={showAlert} baseURL={baseURL} />;
    }
    return null;
  };

  return (
    <div className="manager-container">
      <div className="manager-header">
        <h2>Gerenciamento de Pastas</h2>
        <button className="btn-primary" onClick={() => handleOpenModal('create')}>
          <Icons.Add size={16} /> Criar Nova Pasta
        </button>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome da Pasta</th>
              <th>Documentos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pastas.map((pasta) => (
              <tr key={pasta.id}>
                <td>{pasta.name}</td>
                <td>{pasta.documentos?.length || 0}</td>
                <td className="actions-cell">
                  <button className="icon-button" title="Editar Pasta" onClick={() => handleOpenModal('edit', pasta)}><Icons.EditNote size={16} /></button>
                  <button className="icon-button icon-button--danger" title="Excluir Pasta" onClick={() => handleOpenModal('delete', pasta)}><Icons.Delete size={16} /></button>
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

export default PastasManager;