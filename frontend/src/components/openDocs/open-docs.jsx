import { useMemo, useEffect, useState } from "react";
import { Icons } from "../../constants/icons"; // Ajuste o caminho conforme seu projeto
import { motion } from "framer-motion";
import "./open-docs.css";
import axios from "axios";

// ==========================================================================
// HOOK E UTILITÁRIOS
// ==========================================================================
const useTagCategorization = (tags = []) => {
  return useMemo(() => {
    const categorized = {
      titleTag: null,
      summaryTags: [],
      signatoryTag: null,
      listTags: [],
      dataTags: [],
    };
    if (!tags) return categorized;

    for (const tag of tags) {
      // Pula tags vazias que não são do tipo 'data'
      if (!tag.value && tag.displayCategory !== "data") continue;

      switch (tag.displayCategory) {
        case "title":
          if (!categorized.titleTag) categorized.titleTag = tag;
          break;
        case "summary":
          categorized.summaryTags.push(tag);
          break;
        case "signatory":
          if (!categorized.signatoryTag) categorized.signatoryTag = tag;
          break;
        case "list":
          categorized.listTags.push(tag);
          break;
        case "data":
        default:
          categorized.dataTags.push(tag);
          break;
      }
    }
    return categorized;
  }, [tags]);
};

// ==========================================================================
// SUB-COMPONENTES DE VISUALIZAÇÃO (READ-ONLY)
// ==========================================================================

const DataTagItem = ({
  tag,
  onCopy,
  showAlert,
  onMarkError,
  isMarkedAsError,
}) => {
  const { isNotFound, isExtractionError } = useMemo(() => {
    const notFoundValues = ["", "Não encontrado", null, undefined];
    const errorValues = ["Erro no regex", "Erro na extração IA"];
    return {
      isNotFound: notFoundValues.includes(tag.value),
      isExtractionError: errorValues.includes(tag.value),
    };
  }, [tag.value]);

  const Icon = Icons[tag.icon] || Icons.Tags;
  let displayValue = tag.value;
  if (isNotFound) displayValue = "Não encontrado";
  if (isExtractionError) displayValue = "Erro na extração";

  const canCopy = !isNotFound && !isExtractionError && !isMarkedAsError;
  const canMarkError = !isNotFound && !isExtractionError;

  return (
    <div
      className={`data-tag-item ${isNotFound ? "not-found" : ""} ${
        isExtractionError ? "error-extraction" : ""
      } ${isMarkedAsError ? "error-manual" : ""}`}
    >
      <div className="data-tag-item__header">
        <div className="data-tag-item__label">
          {Icon && <Icon size={14} />}
          <span>{tag.name}</span>
        </div>
        {isExtractionError && (
          <span className="error-icon-static" title="Erro">
            <Icons.AlertTriangle size={15} />
          </span>
        )}
        {canMarkError && (
          <button
            type="button"
            className={`icon-button error-icon-btn ${
              isMarkedAsError ? "active" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onMarkError(tag.id);
              if (!isMarkedAsError) showAlert("error", "Tag marcada com erro!");
            }}
            title="Marcar erro"
          >
            <Icons.AlertTriangle size={15} />
          </button>
        )}
      </div>
      <div
        className="data-tag-item__value"
        onClick={() => canCopy && onCopy(tag.value)}
        title={canCopy ? "Clique para copiar" : ""}
      >
        <p>{displayValue}</p>
        {canCopy && <Icons.Clipboard size={14} className="copy-icon" />}
      </div>
    </div>
  );
};

const TextBlockItem = ({ tag, onCopy }) => (
  <article className="data-content">
    <h4 className="od-title-label">{tag.name}</h4>
    <div className="text-block-item">
      <p onClick={() => onCopy(tag.value)} title="Copiar">
        {tag.value} <Icons.Clipboard size={14} className="copy-icon" />
      </p>
    </div>
  </article>
);

const ListSection = ({ tag, onCopy }) => {
  let items = [];
  try {
    items = JSON.parse(tag.value);
    if (!Array.isArray(items)) items = [tag.value];
  } catch {
    items = [tag.value];
  }
  const Icon =
    tag.name === "Destinatários" ? (
      <Icons.User size={16} />
    ) : (
      <Icons.FileText size={16} />
    );
  return (
    <section className="data-content ">
      <h4 className="od-title-label">
        {tag.name} <span className="item-count">({items.length})</span>
      </h4>

      <div className="list-section">
        <div className="list-section__items">
          {items.map((item, idx) => (
            <div
              className="list-section__item"
              key={idx}
              onClick={() => onCopy(item)}
            >
              <div className="list-section__item-icon">{Icon}</div>
              <span>{item}</span>{" "}
              <Icons.Clipboard size={14} className="copy-icon" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SignatoriesSection = ({ tag }) => {
  let signatories = [];
  try {
    signatories = JSON.parse(tag.value);
    if (!Array.isArray(signatories)) signatories = [JSON.parse(tag.value)];
  } catch {
    signatories = [{ Nome: tag.value, Cargo: "Informação" }];
  }
  return (
    <section className="data-content">
      <h4 className="od-title-label">
        {tag.name} ({signatories.length})
      </h4>
      <div className="signatory-section">
        <div className="signatory-section__items">
          {signatories.map((signer, idx) => (
            <div className="signatory-item" key={idx}>
              <div className="signatory-item__icon">
                <Icons.User size={20} />
              </div>
              <div className="signatory-item__info">
                <span className="signatory-item__name">
                  {signer.Nome || "Nome não encontrado"}
                </span>
                <span className="signatory-item__title">
                  {signer.Cargo || "Cargo não especificado"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================================================
// VIEWS (DATA, STATS, PDF, EDIT)
// ==========================================================================

// 1. View: Visualização de Dados (Leitura)
const ViewData = ({ doc, onCopy, showAlert, onMarkError, markedErrorTags }) => {
  const { titleTag, summaryTags, signatoryTag, listTags, dataTags } =
    useTagCategorization(doc?.tags);

  return (
    <main className="od-main-content">
      <section className="od-title-section">
        <span className="od-title-label">
          {titleTag?.name || "Nome do Arquivo"}
        </span>
        <h2 onClick={() => onCopy(titleTag?.value || doc.name)}>
          {titleTag?.value || doc.name}
          <Icons.Clipboard size={16} className="copy-icon" />
        </h2>
      </section>

      {summaryTags.map((tag) => (
        <TextBlockItem key={tag.id} tag={tag} onCopy={onCopy} />
      ))}

      <section className="od-data-grid">
        {dataTags.map((tag) => (
          <DataTagItem
            key={tag.id}
            tag={tag}
            showAlert={showAlert}
            onCopy={onCopy}
            onMarkError={onMarkError}
            isMarkedAsError={markedErrorTags.has(tag.id)}
          />
        ))}
      </section>

      {signatoryTag && <SignatoriesSection tag={signatoryTag} />}
      {listTags.map((tag) => (
        <ListSection key={tag.id} tag={tag} onCopy={onCopy} />
      ))}
    </main>
  );
};

// 2. View: Edição de Dados (Formulário)
const EditViewData = ({ doc, onSave, onCancel }) => {
  // Inicializa com as tags do documento ATUAL
  const [localTags, setLocalTags] = useState(doc?.tags || []);
  const [isSaving, setIsSaving] = useState(false);

  // IMPORTANTE: Atualiza o estado local se o documento mudar (prop doc mudar)
  useEffect(() => {
    setLocalTags(doc?.tags || []);
  }, [doc]);

  const { titleTag, summaryTags, signatoryTag, listTags, dataTags } =
    useTagCategorization(localTags);

  const handleTagChange = (id, newValue) => {
    setLocalTags((prevTags) =>
      prevTags.map((tag) => (tag.id === id ? { ...tag, value: newValue } : tag))
    );
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSave(localTags);
    setIsSaving(false);
  };

  return (
    <main className="od-main-content edit-mode">
      <div className="edit-header-actions">
        <h3>Modo de Edição</h3>
        <div className="edit-buttons">
          <button
            className="od-btn-cancel"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            className="od-btn-save"
            onClick={handleSaveClick}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}{" "}
            {!isSaving && <Icons.Check size={16} />}
          </button>
        </div>
      </div>

      <div className="edit-form-container">
        {/* Título */}
        <section className="edit-section">
          <label className="edit-label">Título do Documento</label>
          {titleTag ? (
            <input
              type="text"
              className="od-input big-input"
              value={titleTag.value || ""}
              onChange={(e) => handleTagChange(titleTag.id, e.target.value)}
            />
          ) : (
            <p className="text-muted">Tag de título não identificada.</p>
          )}
        </section>

        {/* Resumos */}
        {summaryTags.length > 0 && (
          <section className="edit-section">
            <h4 className="edit-section-title">Resumos e Textos</h4>
            {summaryTags.map((tag) => (
              <div key={tag.id} className="edit-field-group">
                <label className="edit-label">{tag.name}</label>
                <textarea
                  className="od-textarea"
                  rows={5}
                  value={tag.value || ""}
                  onChange={(e) => handleTagChange(tag.id, e.target.value)}
                />
              </div>
            ))}
          </section>
        )}

        {/* Dados (Grid) */}
        {dataTags.length > 0 && (
          <section className="edit-section">
            <h4 className="edit-section-title">Dados Extraídos</h4>
            <div className="edit-grid">
              {dataTags.map((tag) => (
                <div key={tag.id} className="edit-field-group">
                  <div className="edit-label-icon">
                    <Icons.Tags size={12} />
                    <span>{tag.name}</span>
                  </div>
                  <input
                    type="text"
                    className="od-input"
                    value={tag.value || ""}
                    onChange={(e) => handleTagChange(tag.id, e.target.value)}
                    placeholder="Vazio"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* JSON/Complexos */}
        {(listTags.length > 0 || signatoryTag) && (
          <section className="edit-section">
            <h4 className="edit-section-title">
              Dados Complexos (JSON/Listas)
            </h4>
            {signatoryTag && (
              <div className="edit-field-group">
                <label className="edit-label">
                  {signatoryTag.name} (Formato JSON)
                </label>
                <textarea
                  className="od-textarea code-font"
                  rows={4}
                  value={signatoryTag.value || ""}
                  onChange={(e) =>
                    handleTagChange(signatoryTag.id, e.target.value)
                  }
                />
              </div>
            )}
            {listTags.map((tag) => (
              <div key={tag.id} className="edit-field-group">
                <label className="edit-label">{tag.name}</label>
                <textarea
                  className="od-textarea code-font"
                  rows={3}
                  value={tag.value || ""}
                  onChange={(e) => handleTagChange(tag.id, e.target.value)}
                />
              </div>
            ))}
          </section>
        )}
      </div>
    </main>
  );
};

// 3. View: Estatísticas
const DataStatsView = ({ doc, markedErrorTags }) => {
  const {
    totalTags,
    extractionErrors,
    manualErrors,
    notFound,
    validTags,
    validPercent,
  } = useMemo(() => {
    const totalTags = doc.tags.length;
    const extractionErrors = doc.tags.filter(
      (t) => t.value === "Erro na extração IA" || t.value === "Erro no regex"
    ).length;
    const manualErrors = markedErrorTags.size;
    const notFound = doc.tags.filter(
      (t) => !t.value || t.value === "Não encontrado"
    ).length;
    const validTags = totalTags - extractionErrors - manualErrors - notFound;
    const validPercent = totalTags > 0 ? (validTags / totalTags) * 100 : 0;
    return {
      totalTags,
      extractionErrors,
      manualErrors,
      notFound,
      validTags,
      validPercent,
    };
  }, [doc.tags, markedErrorTags]);

  return (
    <aside className="od-data-viewer">
      <div className="od-data-viewer__body">
        <div className="stats-card-pie">
          <div
            className="stats-card__chart-pie"
            style={{ "--p": validPercent, "--c": "var(--color-success)" }}
          >
            {validPercent.toFixed(0)}%
          </div>
          <div className="stats-card__info">
            <span className="stats-card__value">
              {validTags} de {totalTags}
            </span>
            <span className="stats-card__label">Tags Corretas</span>
          </div>
        </div>
        <div className="stats-list">
          {/* ... itens da legenda ... */}
          <div className="stats-list-item">
            <span className="stats-list-label">
              <div
                className="legend-color"
                style={{ backgroundColor: "var(--color-success)" }}
              ></div>
              Corretas
            </span>
            <span className="stats-list-value">{validTags}</span>
          </div>
          <div className="stats-list-item">
            <span className="stats-list-label">
              <div
                className="legend-color"
                style={{ backgroundColor: "var(--color-danger)" }}
              ></div>
              Erros Manuais
            </span>
            <span className="stats-list-value">{manualErrors}</span>
          </div>
          <div className="stats-list-item">
            <span className="stats-list-label">
              <div
                className="legend-color"
                style={{ backgroundColor: "var(--color-warning)" }}
              ></div>
              Erros Extração
            </span>
            <span className="stats-list-value">{extractionErrors}</span>
          </div>
          <div className="stats-list-item">
            <span className="stats-list-label">
              <div
                className="legend-color"
                style={{ backgroundColor: "var(--color-border)" }}
              ></div>
              Não Encontradas
            </span>
            <span className="stats-list-value">{notFound}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

// 4. View: PDF
const ViewPDF = ({ url, title }) => (
  <aside className="od-pdf-viewer">
    <div className="od-pdf-frame">
      <iframe src={url} title={title} width="100%" height="100%" />
    </div>
  </aside>
);

// ==========================================================================
// HEADER
// ==========================================================================

const Header = ({ doc, onDelete, onClose, option, setOption }) => (
  <header className="od-header">
    <div className="od-header__title">
      <h3>{doc.name || "Documento"}</h3>
      <div className="id-doc">
        <h5>ID #{doc.id}</h5>
      </div>
    </div>

    <div className="od-header__actions">
      <ul>
        <li
          className={option === 1 ? "active" : ""}
          onClick={() => setOption(1)}
          title="Dados Extraídos"
        >
          <Icons.DocumentText size={20} />
        </li>
        <li
          className={option === 2 ? "active" : ""}
          onClick={() => setOption(2)}
          title="Estatísticas"
        >
          <Icons.Graphics size={20} />
        </li>
        <li
          className={option === 3 ? "active" : ""}
          onClick={() => setOption(3)}
          title="Visualizar PDF"
        >
          <Icons.Pdf_file size={20} />
        </li>

        <hr />

        <li
          className={option === 5 ? "active" : ""}
          onClick={() => setOption(5)}
          title="Editar Dados (Manual)"
        >
          <Icons.EditNote size={20} />
        </li>

        <li
          className={option === 4 ? "active" : ""}
          onClick={() => {
            setOption(4);
            onDelete();
          }}
          title="Apagar documento"
        >
          <Icons.Delete size={20} />
        </li>

        <hr />

        <li className="od-icon-btn" onClick={onClose} title="Fechar (Esc)">
          <Icons.Close size={20} />
        </li>
      </ul>
    </div>
  </header>
);

// ==========================================================================
// COMPONENTE PRINCIPAL
// ==========================================================================
function OpenDocs({ docSelecionado, onDataChange, showAlert, onClose }) {
  const STATIC_FILE_BASE_URL = "http://localhost:5000";
  const [option, setOption] = useState(1);
  const [markedErrorTags, setMarkedErrorTags] = useState(new Set());

  // === NOVO ESTADO LOCAL PARA GERENCIAR DADOS DO DOCUMENTO ===
  const [currentDoc, setCurrentDoc] = useState(docSelecionado);

  // Sincroniza o estado local quando o prop mudar (ex: abrir outro doc)
  useEffect(() => {
    setCurrentDoc(docSelecionado);
    setMarkedErrorTags(new Set());
    setOption(1);
  }, [docSelecionado]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyToClipboard = (text) => {
    if (!text || text === "Não encontrado" || text.includes("Erro")) return;
    navigator.clipboard.writeText(text);
    showAlert("success", "Texto copiado!");
  };

  const handleDelete = async () => {
    if (
      !window.confirm(`Tem certeza que deseja apagar "${currentDoc.name}"?`)
    )
      return;
    try {
      await axios.delete(`/documents/${currentDoc.id}`);
      showAlert("success", "Documento apagado!");
      onDataChange();
      onClose();
    } catch (error) {
      console.error(error);
      showAlert("error", "Erro ao apagar documento");
    }
  };

  const handleSaveChanges = async (updatedTags) => {
    try {
      // 1. Envia para o backend
      await axios.put(`/documents/${currentDoc.id}/tags`, {
        tags: updatedTags,
      });

      // 2. ATUALIZAÇÃO OTIMISTA: Atualiza o estado local IMEDIATAMENTE
      setCurrentDoc((prev) => ({
        ...prev,
        tags: updatedTags,
      }));

      showAlert("success", "Alterações salvas com sucesso!");
      
      // 3. Avisa o componente pai para atualizar a lista no fundo (sem pressa)
      onDataChange(); 
      
      // 4. Volta para visualização
      setOption(1); 
    } catch (error) {
      console.error(error);
      showAlert("error", "Erro ao salvar alterações.");
    }
  };

  const handleDownload = () => {
    const downloadUrl = `${axios.defaults.baseURL}/documents/download/${currentDoc.id}`;
    window.open(downloadUrl, "_blank");
  };

  const handleMarkError = (tagId) => {
    setMarkedErrorTags((prev) => {
      const newSet = new Set(prev);
      newSet.has(tagId) ? newSet.delete(tagId) : newSet.add(tagId);
      return newSet;
    });
  };

  if (!currentDoc) return null;

  const pdfUrl = `${STATIC_FILE_BASE_URL}/${currentDoc.path.replace(
    /\\/g,
    "/"
  )}`;

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="od-container"
    >
      <div className="open-docs-modal">
        {/* Passamos currentDoc ao invés de docSelecionado */}
        <Header
          doc={currentDoc}
          onDelete={handleDelete}
          onClose={onClose}
          option={option}
          setOption={setOption}
        />

        <div className="od-content-wrapper">
          {(() => {
            switch (option) {
              case 1:
                return (
                  <ViewData
                    doc={currentDoc}
                    onCopy={handleCopyToClipboard}
                    showAlert={showAlert}
                    onMarkError={handleMarkError}
                    markedErrorTags={markedErrorTags}
                  />
                );
              case 2:
                return (
                  <DataStatsView
                    doc={currentDoc}
                    markedErrorTags={markedErrorTags}
                  />
                );
              case 3:
                return (
                  <ViewPDF
                    url={pdfUrl}
                    title={currentDoc.name}
                    onDownload={handleDownload}
                  />
                );
              case 5:
                return (
                  <EditViewData
                    doc={currentDoc}
                    onSave={handleSaveChanges}
                    onCancel={() => setOption(1)}
                  />
                );
              default:
                return (
                  <ViewData
                    doc={currentDoc}
                    onCopy={handleCopyToClipboard}
                    showAlert={showAlert}
                    onMarkError={handleMarkError}
                    markedErrorTags={markedErrorTags}
                  />
                );
            }
          })()}
        </div>
      </div>
    </motion.div>
  );
}

export default OpenDocs;