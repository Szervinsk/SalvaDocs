import { useMemo, useEffect } from "react";
import { Icons } from "../../constants/icons";
import { motion } from "framer-motion";
import "./open-docs.css";
import axios from "axios";

// ==========================================================================
// HOOK CUSTOMIZADO QUE USA O 'displayCategory'
// ==========================================================================
const useTagCategorization = (tags = []) => {
  return useMemo(() => {
    // 1. Prepara os "cestos" para cada categoria de exibição.
    const categorized = {
      titleTag: null,
      summaryTags: [],
      signatoryTag: null,
      listTags: [],
      dataTags: [],
    };

    if (!tags) return categorized;

    // 2. Itera sobre cada tag recebida do documento.
    for (const tag of tags) {
      // Ignora tags sem valor, mas permite que tags de 'dados' sem valor (Não encontrado) apareçam.
      if (!tag.value && tag.displayCategory !== 'data') {
        continue;
      }

      // 3. Coloca a tag no "cesto" correto com base na sua `displayCategory`.
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

    // 4. Retorna os "cestos" preenchidos e organizados.
    return categorized;
  }, [tags]);
};


// ==========================================================================
// SUB-COMPONENTES DE UI
// ==========================================================================
const Header = ({ doc, onClose, onDelete }) => (
  <header className="od-header">
    <div className="od-header__left">
      <div className="od-header__title">
        <Icons.FileText size={16} />
        <h4>{doc.name || "Documento"}</h4>
      </div>
    </div>
    <div className="od-header__right">
      <button className="od-icon-btn od-icon-btn--danger" onClick={onDelete} title="Apagar Documento">
        <Icons.Delete size={16} />
      </button>
      <button className="od-icon-btn" onClick={onClose} title="Fechar (Esc)">
        <Icons.Close size={20} />
      </button>
    </div>
  </header>
);

const DataTagItem = ({ tag, onCopy }) => {
  const Icon = Icons[tag.icon] || Icons.Tags;
  const isNotFound = !tag.value;

  return (
    <div className={`data-tag-item ${isNotFound ? 'not-found' : ''}`}>
      <div className="data-tag-item__label">
        {Icon && <Icon size={14} />}
        <span>{tag.name}</span>
      </div>
      <div className="data-tag-item__value" onClick={() => onCopy(tag.value)}>
        <p>{tag.value || "Não encontrado"}</p>
        {!isNotFound && <Icons.Clipboard size={14} className="copy-icon" />}
      </div>
    </div>
  );
};

const TextBlockItem = ({ tag, onCopy }) => (
  <div className="text-block-item">
    <h4>{tag.name}</h4>
    <p onClick={() => onCopy(tag.value)}>
      {tag.value}
      <Icons.Clipboard size={14} className="copy-icon" />
    </p>
  </div>
);

const ListSection = ({ tag }) => {
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
          <div className="list-section__item" key={idx}>
            <div className="list-section__item-icon">{Icon}</div>
            <span>{item}</span>
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


// ==========================================================================
// COMPONENTE PRINCIPAL
// ==========================================================================
function OpenDocs({ docSelecionado, onDataChange, showAlert, onClose, visualizarPDF, baseURL }) {
  const STATIC_FILE_BASE_URL = "http://localhost:5000"; //url para baixar e exibir o arquivo pdf (sem a /api)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleCopyToClipboard = (text) => {
    if (!text || text === "Não encontrado") return;
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
    const fileUrl = `${STATIC_FILE_BASE_URL}/${docSelecionado.path.replace(/\\/g, '/')}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', docSelecionado.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
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
        <Header doc={docSelecionado} onClose={onClose} onDelete={handleDelete} />

        <div className="od-content-wrapper">
          <main className="od-main-content" style={{width: !visualizarPDF ? "100%" : ""}}>

            {/* 1. Título (da categoria 'title') */}
            <section className="od-title-section">
              <span className="od-title-label">{titleTag?.name || "Nome do Arquivo"}</span>
              <h2 onClick={() => handleCopyToClipboard(titleTag?.value || docSelecionado.name)}>
                {titleTag?.value || docSelecionado.name}
                <Icons.Clipboard size={16} className="copy-icon" />
              </h2>
            </section>

            {/* 2. Resumos (da categoria 'summary') */}
            {summaryTags.map(tag => (
              <TextBlockItem key={tag.id} tag={tag} onCopy={handleCopyToClipboard} />
            ))}

            {/* 3. Dados Principais ("Caixinhas", da categoria 'data') */}
            <section className="od-data-grid">
              {dataTags.map(tag => (
                <DataTagItem key={tag.id} tag={tag} onCopy={handleCopyToClipboard} />
              ))}
            </section>

            {/* 4. Signatário (da categoria 'signatory') */}
            {signatoryTag && <SignatoriesSection tag={signatoryTag} />}

            {/* 5. Outras Listas (da categoria 'list') */}
            {listTags.map(tag => (
              <ListSection key={tag.id} tag={tag} />
            ))}

          </main>

          {/* <header className="od-viewer-header">
              <p>{docSelecionado.name}</p>
              <button className="icon-button" onClick={handleDownload} title="Baixar PDF">
                <Icons.Download size={16} />
              </button>
            </header> */}

          {visualizarPDF && (
            <aside className="od-pdf-viewer">
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
        </div>
      </motion.div>
    </div>
  );
}

export default OpenDocs;