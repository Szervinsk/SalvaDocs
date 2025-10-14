import { useState, useMemo, useEffect } from "react";
import { Icons } from "../../constants/icons";
import { motion, AnimatePresence } from "framer-motion";
import "./open-docs.css";
import axios from "axios";

// --- Sub-componente: Cabeçalho do Modal ---
const Header = ({ doc, onClose, onDelete, onToggleExpand, isExpanded }) => (
  <header className="od-header">
    <div className="od-header__left">
      <button className="od-icon-btn danger" onClick={onDelete}>
        <Icons.Delete size={16} />
      </button>
      <div className="od-header__title">
        <Icons.FileText size={16} />
        <h4>{doc.resolvedTemplate || doc.templateName}</h4>
      </div>
    </div>
    <div className="od-header__right">
      <button className="od-icon-btn" onClick={onClose} title="Fechar (Esc)">
        <Icons.Close size={20} />
      </button>
    </div>
  </header>
);

// --- Sub-componente: Tag Individual ---
const TagItem = ({ tag, onCopy }) => {
  const Icon = Icons[tag.icon] || Icons.Tags;
  const isNotFound = tag.value === "Não encontrado" || !tag.value;

  return (
    <div className={`od-tag-item ${isNotFound ? 'not-found' : ''}`}>
      <div className="od-tag-item__label">
        {Icon && <Icon size={14} />}
        <span>{tag.name}</span>
      </div>
      <div className="od-tag-item__value" onClick={() => onCopy(tag.value)}>
        <p>{tag.value || "Não encontrado"}</p>
        <Icons.Clipboard size={14} className="copy-icon" />
      </div>
    </div>
  );
};

// --- Sub-componente: Navegação das Abas ---
const ViewSwitcher = ({ viewMode, setViewMode, docCount }) => (
  <nav className="od-view-switcher">
    <button className={viewMode === 'resumo' ? 'active' : ''} onClick={() => setViewMode('resumo')}>
      <Icons.TextSearch size={14} /> Resumo
    </button>
    <button className={viewMode === 'docs' ? 'active' : ''} onClick={() => setViewMode('docs')}>
      <Icons.FileList size={14} /> Documentos ({docCount})
    </button>
    <button className={viewMode === 'json' ? 'active' : ''} onClick={() => setViewMode('json')}>
      <Icons.Code size={14} /> JSON
    </button>
  </nav>
);

// --- Componente Principal ---
function OpenDocs({
  docSelecionado,
  setDocumentos,
  showAlert,
  onClose,
  onToggleExpand,
  isExpanded,
}) {
  const [viewMode, setViewMode] = useState("resumo");

  // Fechar o modal com a tecla 'Esc'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Função para copiar texto e mostrar alerta
  const handleCopyToClipboard = (text) => {
    if (!text || text === "Não encontrado") return;
    navigator.clipboard.writeText(text);
    showAlert("success", "Texto copiado para a área de transferência!");
  };

  // Lógica para deletar o documento
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja apagar este documento?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/files/documentos/${docSelecionado.id}`);
      setDocumentos(prev => prev.filter(d => d.id !== docSelecionado.id));
      showAlert("success", "Documento apagado com sucesso!");
      onClose();
      window.location.reload()
    } catch (error) {
      console.error(error);
      showAlert("error", "Erro ao apagar documento");
    }
  };

  // Memoiza os dados das tags para otimização
  const { titleTag, summaryTags, docsTag, otherTags } = useMemo(() => {
    if (!docSelecionado?.tags) return { otherTags: [] };
    const tags = docSelecionado.tags;
    const priorityTitle = ["Título", "Assunto", "Título Parecer"];
    
    return {
      titleTag: tags.find(t => priorityTitle.includes(t.name)),
      summaryTags: tags.filter(t => ["Resumo", "Resumo Parecer"].includes(t.name) && t.value),
      docsTag: tags.find(t => t.name === "Documentos referenciados"),
      otherTags: tags.filter(t => !priorityTitle.includes(t.name) && !["Resumo", "Resumo Parecer", "Documentos referenciados"].includes(t.name))
    };
  }, [docSelecionado]);
  
  const docCount = useMemo(() => {
    if (!docsTag?.value) return 0;
    try {
      const parsed = JSON.parse(docsTag.value);
      return Array.isArray(parsed) ? parsed.length : 1;
    } catch {
      return 1;
    }
  }, [docsTag]);
  
  if (!docSelecionado) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="open-docs-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <Header 
            doc={docSelecionado} 
            onClose={onClose} 
            onDelete={handleDelete} 
            onToggleExpand={onToggleExpand} 
            isExpanded={isExpanded}
        />

        <main className="od-main-content">
          {/* Título Principal */}
          <section className="od-title-section">
            <h2 onClick={() => handleCopyToClipboard(titleTag?.value || docSelecionado.name)}>
              {titleTag?.value || docSelecionado.name}
              <Icons.Clipboard size={16} className="copy-icon" />
            </h2>
            <span className="od-title-label">{titleTag?.name || "Nome do Arquivo"}</span>
          </section>

          {/* Tags Gerais */}
          <section className="od-tags-section">
            {otherTags.map(tag => (
              <TagItem key={tag.id} tag={tag} onCopy={handleCopyToClipboard} />
            ))}
          </section>

          {/* Navegação e Conteúdo Dinâmico */}
          <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} docCount={docCount} />
          
          <AnimatePresence mode="wait">
            <motion.section
              key={viewMode}
              className="od-dynamic-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === "resumo" && (
                <div className="od-summary-view">
                  {summaryTags.length > 0 ? (
                    summaryTags.map(tag => <p key={tag.id}>{tag.value}</p>)
                  ) : (
                    <p className="placeholder-text">Nenhum resumo encontrado.</p>
                  )}
                </div>
              )}

              {viewMode === "docs" && (
                <div className="od-docs-view">
                  {docsTag?.value ? (
                    (() => {
                        try {
                            const docs = JSON.parse(docsTag.value);
                            return (Array.isArray(docs) ? docs : [docs]).map((docName, idx) => (
                                <div className="od-doc-item" key={idx}>
                                <Icons.FileText size={18} />
                                <span>{docName}</span>
                                </div>
                            ));
                        } catch {
                            return (
                                <div className="od-doc-item">
                                <Icons.FileText size={18} />
                                <span>{docsTag.value}</span>
                                </div>
                            );
                        }
                    })()
                  ) : (
                    <p className="placeholder-text">Nenhum documento referenciado.</p>
                  )}
                </div>
              )}

              {viewMode === "json" && (
                <pre className="od-json-view">{JSON.stringify(docSelecionado, null, 2)}</pre>
              )}
            </motion.section>
          </AnimatePresence>
        </main>

        <footer className="od-footer">
            <button className="btn-secondary"><Icons.Pdf_file size={16}/> Visualizar PDF</button>
            <button className="btn-primary"><Icons.Upload size={16}/> Baixar Documento</button>
        </footer>
      </motion.div>
    </div>
  );
}

export default OpenDocs;