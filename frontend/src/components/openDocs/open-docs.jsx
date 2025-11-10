import { useMemo, useEffect, useState } from "react";
import { Icons } from "../../constants/icons";
import { motion } from "framer-motion";
import "./open-docs.css";
import axios from "axios";

// ==========================================================================
// HOOK CUSTOMIZADO QUE USA O 'displayCategory'
// ==========================================================================
const useTagCategorization = (tags = []) => {
  return useMemo(() => {
    // 1. Prepara os "cestos"
    const categorized = {
      titleTag: null,
      summaryTags: [],
      signatoryTag: null,
      listTags: [],
      dataTags: [],
    };
    if (!tags) return categorized;

    // 2. Itera e coloca no "cesto" correto
    for (const tag of tags) {
      if (!tag.value && tag.displayCategory !== 'data') {
        continue;
      }
      switch (tag.displayCategory) {
        case 'title':
          if (!categorized.titleTag) categorized.titleTag = tag;
          break;
        case 'summary':
          categorized.summaryTags.push(tag);
          break;
        case 'signatory':
          if (!categorized.signatoryTag) categorized.signatoryTag = tag;
          break;
        case 'list':
          categorized.listTags.push(tag);
          break;
        case 'data':
        default:
          categorized.dataTags.push(tag);
          break;
      }
    }
    // 4. Retorna os "cestos" preenchidos
    return categorized;
  }, [tags]);
};


// ==========================================================================
// SUB-COMPONENTES DE UI
// ==========================================================================

const Header = ({ doc, onClose, onDelete, rightView, setRightView }) => (
  <header className="od-header">
    <div className="od-header__left">
      <div className="od-header__title">
        <Icons.FileText size={16} />
        <h4>{doc.name || "Documento"}</h4>
      </div>
    </div>
    <div className="od-header__right">
      <button
        className={`od-icon-btn ${rightView === 'data' ? 'active' : ''}`}
        onClick={() => setRightView(rightView === 'pdf' ? 'data' : 'pdf')}
        title={rightView === 'pdf' ? "Ver Estatísticas" : "Ver PDF"}
      >
        {rightView === 'pdf' ? <Icons.Graphics size={16} /> : <Icons.FileText size={16} />}
      </button>

      <button className="od-icon-btn od-icon-btn--danger" onClick={onDelete} title="Apagar Documento">
        <Icons.Delete size={16} />
      </button>
      <button className="od-icon-btn" onClick={onClose} title="Fechar (Esc)">
        <Icons.Close size={20} />
      </button>
    </div>
  </header>
);

const DataTagItem = ({ tag, onCopy, showAlert, onMarkError, isMarkedAsError }) => {

  // 1. Lógica movida para constantes (useMemo para otimização)
  const { isNotFound, isExtractionError } = useMemo(() => {
    const notFoundValues = ["", "Não encontrado", null, undefined];
    // Adicionado "Erro regex" para consistência
    const errorValues = ["Erro no regex", "Erro na extração IA"];

    return {
      isNotFound: notFoundValues.includes(tag.value),
      isExtractionError: errorValues.includes(tag.value)
    };
  }, [tag.value]);

  const Icon = Icons[tag.icon] || Icons.Tags;

  // 2. Define o valor a ser exibido
  let displayValue = tag.value;
  if (isNotFound) displayValue = "Não encontrado";
  if (isExtractionError) displayValue = "Erro na extração";

  // 3. Define as condições de interação
  const canCopy = !isNotFound && !isExtractionError && !isMarkedAsError;
  const canMarkError = !isNotFound && !isExtractionError;

  const handleErrorClick = (e) => {
    e.stopPropagation(); // Impede que o clique acione o onCopy do card
    if (!isMarkedAsError) {
      showAlert("error", "Tag marcada com erro!");
    } else {
      showAlert("success", "Erro removido da tag!");
    }
    onMarkError(tag.id); // Chama a função do pai para marcar o erro
  };

  const handleCopyClick = () => {
    if (!canCopy) return; // Não copia se for "Não encontrado", Erro de Extração ou Erro Manual
    onCopy(tag.value);
  };

  return (
    // 4. Classes CSS agora são aplicadas dinamicamente com base nas constantes.
    <div className={`data-tag-item ${isNotFound ? 'not-found' : ''} ${isExtractionError ? 'error-extraction' : ''} ${isMarkedAsError ? 'error-manual' : ''}`}>
      <div className="data-tag-item__header">
        <div className="data-tag-item__label">
          {Icon && <Icon size={14} />}
          <span>{tag.name}</span>
        </div>

        {/* 5. Ícone de erro de extração (automático, não clicável) */}
        {isExtractionError && (
          <span className="error-icon-static" title="Houve um erro na extração desta tag">
            <Icons.AlertTriangle size={15} />
          </span>
        )}

        {/* 6. Botão de marcar erro (manual, clicável) */}
        {canMarkError && (
          <button
            type="button"
            className={`icon-button error-icon-btn ${isMarkedAsError ? 'active' : ''}`}
            onClick={handleErrorClick}
            title={isMarkedAsError ? "Desmarcar erro" : "Marcar como dado incorreto"}
          >
            <Icons.AlertTriangle size={15} />
          </button>
        )}
      </div>

      <div
        className="data-tag-item__value"
        onClick={handleCopyClick}
        title={canCopy ? "Clique para copiar" : ""}
      >
        <p>{displayValue}</p>

        {/* 7. Ícone de copiar só aparece se houver valor válido */}
        {canCopy && (
          <Icons.Clipboard size={14} className="copy-icon" />
        )}
      </div>
    </div>
  );
};

const TextBlockItem = ({ tag, onCopy }) => (
  <div className="text-block-item">
    <h4>{tag.name}</h4>
    <p onClick={() => onCopy(tag.value)} title="Clique para copiar">
      {tag.value}
      <Icons.Clipboard size={14} className="copy-icon" />
    </p>
  </div>
);

const ListSection = ({ tag, onCopy }) => {
  let items;
  try {
    const parsed = JSON.parse(tag.value);
    items = Array.isArray(parsed) ? parsed : [tag.value];
  } catch {
    items = [tag.value];
  }
  const Icon = tag.name === 'Destinatários' ? <Icons.User size={16} /> : <Icons.FileText size={16} />;

  return (
    <div className="list-section">
      <h4>{tag.name} <span className="item-count">({items.length})</span></h4>
      <div className="list-section__items">
        {items.map((item, idx) => (
          <div className="list-section__item" key={idx} onClick={() => onCopy(item)} title="Clique para copiar">
            <div className="list-section__item-icon">{Icon}</div>
            <span>{item}</span>
            <Icons.Clipboard size={14} className="copy-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

const SignatoryItem = ({ signer }) => (
  <div className="signatory-item">
    <div className="signatory-item__icon"><Icons.User size={20} /></div>
    <div className="signatory-item__info">
      <span className="signatory-item__name">{signer.Nome || "Nome não encontrado"}</span>
      <span className="signatory-item__title">{signer.Cargo || "Cargo não especificado"}</span>
    </div>
  </div>
);

const SignatoriesSection = ({ tag }) => {
  let signatories = [];
  try {
    const parsed = JSON.parse(tag.value);
    signatories = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    signatories = [{ Nome: tag.value, Cargo: 'Informação' }];
  }
  return (
    <div className="signatory-section">
      <h4>{tag.name} ({signatories.length})</h4>
      <div className="signatory-section__items">
        {signatories.map((signer, idx) => (
          <SignatoryItem key={idx} signer={signer} />
        ))}
      </div>
    </div>
  );
};

// Componente para a aba de Estatísticas
const DataStatsView = ({ doc, markedErrorTags }) => {
  const { totalTags, extractionErrors, manualErrors, notFound, validTags, validPercent } = useMemo(() => {
    const totalTags = doc.tags.length;
    const extractionErrors = doc.tags.filter(t => t.value === "Erro na extração IA" || t.value === "Erro no regex").length;
    const manualErrors = markedErrorTags.size;
    const notFound = doc.tags.filter(t => !t.value || t.value === "Não encontrado").length;
    const validTags = totalTags - extractionErrors - manualErrors - notFound;
    const validPercent = totalTags > 0 ? (validTags / totalTags) * 100 : 0;
    return { totalTags, extractionErrors, manualErrors, notFound, validTags, validPercent };
  }, [doc.tags, markedErrorTags]);

  return (
    <aside className="od-data-viewer">
      <header className="od-viewer-header">
        <p>Estatísticas de Extração</p>
      </header>
      <div className="od-data-viewer__body">
        <div className="stats-card-pie">
          <div
            className="stats-card__chart-pie"
            style={{ "--p": validPercent, "--c": "var(--color-success)" }}
            title={`Precisão de ${validPercent.toFixed(0)}%`}
          >
            {validPercent.toFixed(0)}%
          </div>
          <div className="stats-card__info">
            <span className="stats-card__value">{validTags} de {totalTags}</span>
            <span className="stats-card__label">Tags Corretas</span>
          </div>
        </div>
        <div className="stats-list">
          <div className="stats-list-item">
            <span className="stats-list-label"><div className="legend-color" style={{ backgroundColor: 'var(--color-success)' }}></div>Tags Corretas</span>
            <span className="stats-list-value">{validTags}</span>
          </div>
          <div className="stats-list-item">
            <span className="stats-list-label"><div className="legend-color" style={{ backgroundColor: 'var(--color-danger)' }}></div>Erros Manuais</span>
            <span className="stats-list-value">{manualErrors}</span>
          </div>
          <div className="stats-list-item">
            <span className="stats-list-label"><div className="legend-color" style={{ backgroundColor: 'var(--color-warning)' }}></div>Erros de Extração</span>
            <span className="stats-list-value">{extractionErrors}</span>
          </div>
          <div className="stats-list-item">
            <span className="stats-list-label"><div className="legend-color" style={{ backgroundColor: 'var(--color-border)' }}></div>Não Encontradas</span>
            <span className="stats-list-value">{notFound}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};


// ==========================================================================
// COMPONENTE PRINCIPAL (OpenDocs)
// ==========================================================================
function OpenDocs({ docSelecionado, onDataChange, showAlert, onClose, visualizarPDF, baseURL }) {
  const STATIC_FILE_BASE_URL = "http://localhost:5000";
  const [rightView, setRightView] = useState('pdf');
  const [markedErrorTags, setMarkedErrorTags] = useState(new Set());

  useEffect(() => {
    setMarkedErrorTags(new Set());
    setRightView('pdf');
  }, [docSelecionado]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyToClipboard = (text) => {
    if (!text || text === "Não encontrado" || text.includes("Erro na extração")) return;
    navigator.clipboard.writeText(text);
    showAlert("success", "Texto copiado!");
  };

  const handleDelete = async () => {
    if (!window.confirm(`Tem certeza que deseja apagar o documento "${docSelecionado.name}"?`)) return;
    try {
      await axios.delete(`/documents/${docSelecionado.id}`);
      showAlert("success", "Documento apagado com sucesso!");
      onDataChange();
      onClose();
    } catch (error) {
      console.error("Erro ao apagar documentos:", error);
      showAlert("error", "Erro ao apagar documento");
    }
  };

  const handleDownload = () => {
    const downloadUrl = `${axios.defaults.baseURL}/documents/download/${docSelecionado.id}`;
    window.open(downloadUrl, '_blank');
  };

  const handleMarkError = (tagId) => {
    setMarkedErrorTags(prevSet => {
      const newSet = new Set(prevSet);
      if (newSet.has(tagId)) {
        newSet.delete(tagId);
      } else {
        newSet.add(tagId);
      }
      return newSet;
    });
  };

  const { titleTag, summaryTags, signatoryTag, listTags, dataTags } = useTagCategorization(docSelecionado?.tags);

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
          rightView={rightView}
          setRightView={setRightView}
        />

        <div className="od-content-wrapper">
          <main className="od-main-content" style={{ width: rightView === 'none' ? "100%" : "" }}>

            <section className="od-title-section">
              <span className="od-title-label">{titleTag?.name || "Nome do Arquivo"}</span>
              <h2 onClick={() => handleCopyToClipboard(titleTag?.value || docSelecionado.name)}>
                {titleTag?.value || docSelecionado.name}
                <Icons.Clipboard size={16} className="copy-icon" />
              </h2>
            </section>

            {summaryTags.map(tag => (
              <TextBlockItem key={tag.id} tag={tag} onCopy={handleCopyToClipboard} />
            ))}

            <section className="od-data-grid">
              {dataTags.map(tag => (
                <DataTagItem
                  key={tag.id}
                  tag={tag}
                  showAlert={showAlert}
                  onCopy={handleCopyToClipboard}
                  onMarkError={handleMarkError}
                  isMarkedAsError={markedErrorTags.has(tag.id)}
                />
              ))}
            </section>

            {signatoryTag && <SignatoriesSection tag={signatoryTag} />}

            {listTags.map(tag => (
              <ListSection key={tag.id} tag={tag} onCopy={handleCopyToClipboard} />
            ))}

          </main>

          {/* Renderização condicional da barra lateral direita */}
          {rightView === 'pdf' && (
            <aside className="od-pdf-viewer">
              <header className="od-viewer-header">
                <p>{docSelecionado.name}</p>
                <button className="icon-button" onClick={handleDownload} title="Baixar PDF">
                  <Icons.Download size={16} />
                </button>
              </header>
              <div className="od-pdf-frame">
                <iframe
                  src={`${STATIC_FILE_BASE_URL}/${docSelecionado.path.replace(/\\/g, '/')}`}
                  title={docSelecionado.name}
                  width="100%"
                  height="100%"
                />
              </div>
            </aside>
          )}

          {rightView === 'data' && (
            <DataStatsView
              doc={docSelecionado}
              markedErrorTags={markedErrorTags}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default OpenDocs;