import SearchBar from "../searchBar/searchbar";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Icons } from "../../../constants/icons";
import { motion, AnimatePresence } from "framer-motion";
import "./library.css";
import axios from "axios";

// ==========================================================================
// SUB-COMPONENTE: MENU DE CONTEXTO (MAIS OPÇÕES)
// ==========================================================================
const MoreFolders = ({ x, y, folder, onEdit, onDelete, onClose }) => {
  const menuItems = [
    { id: 1, name: "Renomear Pasta", icon: <Icons.EditNote size={16} />, action: () => onEdit(folder) },
    { id: 2, name: "Apagar Pasta", icon: <Icons.Delete size={16} />, action: () => onDelete(folder), isDanger: true },
  ];

  return (
    <motion.div
      className="more-folders-dropdown"
      style={{ top: y, left: x }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()} // Impede que o clique no menu o feche
    >
      <div className="more-folders__header">
        <h4>{folder.name}</h4>
      </div>
      <div className="more-folders__list">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`dropdown-item ${item.isDanger ? 'is-danger' : ''}`}
            onClick={() => {
              item.action();
              onClose(); // Fecha o menu após a ação
            }}
          >
            <div className="dropdown-item__icon">{item.icon}</div>
            <span className="dropdown-item__name">{item.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

// ==========================================================================
// SUB-COMPONENTE: ITEM DE DOCUMENTO
// ==========================================================================
const DocumentItem = ({ doc, docSelecionado, onClick }) => {
  const displayName = doc.resolvedTemplate || doc.templateName || "Documento sem nome";
  const isActive = docSelecionado?.id === doc.id;

  return (
    <div
      className={`document-item ${isActive ? "active" : ""}`}
      onClick={() => onClick(doc)}
    >
      <Icons.DocumentText size={16} className="document-icon" />
      <span title={displayName}>
        {displayName.length > 25 ? `${displayName.slice(0, 25)}...` : displayName}
      </span>
    </div>
  );
};

// ==========================================================================
// SUB-COMPONENTE: BLOCO DE PASTA (COM LÓGICA DE EDIÇÃO)
// ==========================================================================
const FolderBlock = ({ pasta, isEditing, onRename, onCancelEdit, docSelecionado, onDocClick, abrirPastaSeFiltrada, onContextMenu }) => {
  const [isAberta, setIsAberta] = useState(false);
  const [inputValue, setInputValue] = useState(pasta.name);

  useEffect(() => {
    if (abrirPastaSeFiltrada) {
      setIsAberta(true);
    }
  }, [abrirPastaSeFiltrada]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputValue.trim() && inputValue.trim() !== pasta.name) {
        onRename(pasta.id, inputValue.trim());
      } else {
        onCancelEdit();
      }
    } else if (event.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <div className="folder-block">
      <div className={`folder-header ${isAberta ? "active" : ""}`} onClick={() => !isEditing && setIsAberta(p => !p)}>
        <div className="folder-info">
          <Icons.Folder size={20} />
          {isEditing ? (
            <input
              type="text"
              className="folder-rename-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={onCancelEdit}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3>{pasta.name}</h3>
          )}
        </div>
        {!isEditing && (
          <div className="folder-info">
            <span className="doc-count">{pasta.documentos?.length || 0}</span>
            <button className="icon-btn more-options-btn" title="Mais opções" onClick={(e) => {
              e.stopPropagation();
              onContextMenu(e, pasta);
            }}>
              <Icons.MoreHorizontal size={20} />
            </button>
            <Icons.ArrowDown size={16} className={`arrow-icon ${isAberta ? "rotated" : ""}`} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAberta && (
          <motion.div
            className="documents-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {pasta.documentos?.length > 0 ? (
              pasta.documentos.map(doc => <DocumentItem key={doc.id} doc={doc} docSelecionado={docSelecionado} onClick={onDocClick} />)
            ) : <p className="empty-text">Nenhum documento nesta pasta.</p>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL (FOLDERSACTION)
// ==========================================================================
function FoldersAction({ pastas, documentos, loading, docSelecionado, setDocSelecionado, onDataChange, showAlert, baseURL }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isReduzido, setIsReduzido] = useState(false);
  const [viewRecentDocs, setViewRecentDocs] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, folder: null });
  const [editingFolderId, setEditingFolderId] = useState(null);

  const handleDocumentClick = (doc) => {
    setDocSelecionado(prev => (prev?.id === doc.id ? null : doc));
  };

  const pastasComDocumentosFiltrados = useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    if (!lowerCaseQuery) {
      return pastas.map(p => ({
        ...p,
        documentos: documentos.filter(d => d.folderId === p.id)
      }));
    }
    const filteredDocs = documentos.filter(doc =>
      (doc.templateName || doc.name || "").toLowerCase().includes(lowerCaseQuery)
    );
    const filteredDocFolderIds = new Set(filteredDocs.map(d => d.folderId));
    return pastas
      .map(pasta => ({
        ...pasta,
        documentos: filteredDocs.filter(doc => doc.folderId === pasta.id)
      }))
      .filter(pasta =>
        pasta.name.toLowerCase().includes(lowerCaseQuery) || filteredDocFolderIds.has(pasta.id)
      );
  }, [searchQuery, pastas, documentos]);

  const recentDocuments = useMemo(() => {
    return [...documentos]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [documentos]);

  const handleContextMenu = (event, folder) => {
    setContextMenu({ visible: true, x: event.pageX, y: event.pageY, folder: folder });
  };
  const handleCloseContextMenu = useCallback(() => setContextMenu(c => ({ ...c, visible: false })), []);

  useEffect(() => {
    if (contextMenu.visible) {
      window.addEventListener('click', handleCloseContextMenu);
    }
    return () => window.removeEventListener('click', handleCloseContextMenu);
  }, [contextMenu.visible, handleCloseContextMenu]);

  const handleStartEdit = (folder) => {
    setEditingFolderId(folder.id);
  };

  const handleRenameFolder = async (folderId, newName) => {
    try {
      await axios.put(`/folders/${folderId}`, { name: newName });
      showAlert("success", "Pasta renomeada com sucesso!");
      onDataChange();
    } catch (err) {
      console.error("Erro ao renomear pasta:", err);
      showAlert("error", "Não foi possível renomear a pasta.");
    } finally {
      setEditingFolderId(null);
    }
  };

  const handleDeleteFolder = (folder) => {
    // Aqui você pode chamar um modal de confirmação do App.jsx, se tiver um
    if (window.confirm(`Tem certeza que deseja apagar a pasta "${folder.name}"?`)) {
      axios.delete(`/folders/${folder.id}`)
        .then(() => {
          showAlert("success", "Pasta excluída com sucesso!");
          onDataChange();
        })
        .catch(err => {
          console.error("Erro ao apagar pasta:", err);
          showAlert("error", "Não foi possível apagar a pasta.");
        });
    }
  };

  return (
    <motion.div
      className={`sidebar ${isReduzido ? "reduzido" : ""}`}
      animate={{ width: isReduzido ? 70 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="sidebar-header">
        {!isReduzido && <h2>Biblioteca</h2>}
        <button className="icon-btn" onClick={() => setIsReduzido(p => !p)} title={isReduzido ? "Expandir" : "Reduzir"}>
          <Icons.BackIn size={20} />
        </button>
      </div>

      {!isReduzido && (
        <div className="sidebar-controls">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar..." />
        </div>
      )}

      <div className="folders-list">
        {loading ? <p className="loading-text">Carregando...</p> : (
          pastasComDocumentosFiltrados.length > 0 ? (
            pastasComDocumentosFiltrados.map((pasta) => {
              const deveAbrir = searchQuery.length > 0 && pasta.documentos.length > 0;
              return (
                <FolderBlock
                  key={pasta.id}
                  pasta={pasta}
                  isEditing={editingFolderId === pasta.id}
                  onRename={handleRenameFolder}
                  onCancelEdit={() => setEditingFolderId(null)}
                  docSelecionado={docSelecionado}
                  onDocClick={handleDocumentClick}
                  abrirPastaSeFiltrada={deveAbrir}
                  onContextMenu={handleContextMenu}
                />
              );
            })
          ) : <p className="empty-text">Nenhum resultado encontrado.</p>
        )}
      </div>

      {!isReduzido && (
        <div className="sidebar-footer">
          <div className={`recent-docs-header ${viewRecentDocs ? "active" : ""}`} onClick={() => setViewRecentDocs(prev => !prev)}>
            <h3>Documentos Recentes</h3>
            <Icons.ArrowDown size={16} className={`arrow-icon ${viewRecentDocs ? "rotated" : ""}`} />
          </div>
          <AnimatePresence>
            {viewRecentDocs && (
              <motion.div
                className="recent-docs-list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {recentDocuments.length > 0 ? (
                  recentDocuments.map((doc) => (
                    <div key={doc.id} className="recent-doc-item" onClick={() => handleDocumentClick(doc)}>
                      <div className="recent-doc-info">
                        <span className="recent-doc-name">{doc.templateName || doc.name}</span>
                        <span className="recent-doc-date">{new Date(doc.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <Icons.ArrowRight size={14} />
                    </div>
                  ))
                ) : (
                  <p className="no-docs">Nenhum documento recente</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {contextMenu.visible && (
          <MoreFolders
            x={contextMenu.x}
            y={contextMenu.y}
            folder={contextMenu.folder}
            onEdit={handleStartEdit}
            onDelete={handleDeleteFolder}
            onClose={handleCloseContextMenu}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FoldersAction;