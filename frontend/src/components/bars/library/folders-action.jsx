import SearchBar from "../searchBar/searchbar";
import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import { motion, AnimatePresence } from "framer-motion";
import "./library.css";
import axios from "axios";

function FoldersAction({
  pastas,
  documentos,
  setDocumentos,
  setDocSelecionado,
  docSelecionado,
  setBarraLateral,
  barraLateral,
  onClose,
  setOpenDocsVisible,
  openDocsVisible,
}) {
  const [pastasAbertas, setPastasAbertas] = useState({}); // estado para controlar quais pastas deverão abrir ou não
  const [loading, setLoading] = useState(false); //carregar dados caso não chegue da api

  const [searchQuery, setSearchQuery] = useState(""); // estado para a busca
  const [placeholder, setPlaceholder] = useState("Buscar pastas..."); // placeholder para pesquisar

  const [modo, setModo] = useState("pastas"); // "pastas" | "modelos"
  const [folderSlide, setFolderSlide] = useState(null); // true = reduzido, false = expandido
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [viewRecentDocs, setViewRecentDocs] = useState(false);

  // Ordenar documentos recentes
  useEffect(() => {
    const sorted = [...documentos]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    setRecentDocuments(sorted);
  }, [documentos]);


  useEffect(() => {
    const fetchDocumentos = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/files/documentos"
        );
        setDocumentos(data);
        console.log(data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentos();
  }, [setDocumentos]);

  const toggleFolderSlide = () => setFolderSlide((prev) => !prev);
  const togglePasta = (id) =>
    setPastasAbertas((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDocumentClick = (doc) => {
    if (docSelecionado === doc) {
      setDocSelecionado(null); // deseleciona se clicar novamente no mesmo doc
      setBarraLateral(true);
      onClose(false);
    } else {
      setBarraLateral(false); // fecha a lateral quando abre doc
      setDocSelecionado(doc); // seleciona doc
    }
  };


  // Filtragem de pastas
  const pastasFiltradas = pastas
    .map((pasta) => {
      const docs = documentos.filter(
        (doc) =>
          doc.model === pasta.name &&
          (doc.templateName || doc.name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      if (
        docs.length > 0 ||
        pasta.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return { ...pasta, documentos: docs };
      }
      return null;
    })
    .filter(Boolean);

  // Filtragem de documentos quando o modo é "modelos"
  const documentosFiltrados = documentos.filter((doc) =>
    (doc.templateName || doc.name)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      className={`sidebar ${folderSlide ? "reduzido" : ""}`}
      animate={{ width: folderSlide ? 70 : 280 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header da Sidebar */}
      <div className="sidebar-header">
        {!folderSlide && <h2>Pastas</h2>}
        <Icons.BackIn
          size={20}
          className="icon-btn"
          onClick={toggleFolderSlide}
          title={folderSlide ? "Expandir" : "Reduzir"}
        />
      </div>

      {/* Toggle Pastas/Modelos */}
      {!folderSlide ? (
        <div className="mode-toggle">
          <div
            className="toggle-bg"
            style={{
              transform:
                modo === "modelos" ? "translateX(115%)" : "translateX(0)",
            }}
          />
          <label
            onClick={() => (
              setModo("pastas"), setPlaceholder("Buscar pastas...")
            )}
          >
            <Icons.Folder size={16} style={{ marginRight: 6 }} />
            <input
              type="radio"
              name="mode"
              value="pastas"
              checked={modo === "pastas"}
              readOnly
              style={{ display: "none" }}
            />
            Pastas
          </label>
          <label
            onClick={() => (
              setModo("modelos"), setPlaceholder("Buscar documentos...")
            )}
          >
            <Icons.DocumentText size={16} style={{ marginRight: 6 }} />
            <input
              type="radio"
              name="mode"
              value="modelos"
              checked={modo === "modelos"}
              readOnly
              style={{ display: "none" }}
            />
            Docs
          </label>
        </div>
      ) : (
        <div className="mode-toggle reduzido-toggle">
          {modo === "pastas" ? (
            <Icons.Folder size={18} />
          ) : (
            <Icons.DocumentText size={18} />
          )}
        </div>
      )}

      {/* Search */}
      {!folderSlide ? (
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={placeholder}
        />
      ) : (
        <div className="search-container">
          <Icons.Search
            size={20}
            className="search-icon"
            style={{ margin: "auto" }}
          />
        </div>
      )}

      <hr style={{marginBlock: "var(--spacing-md)"}}/>

      {/* Conteúdo: pastas ou documentos */}
      <div className="folders-list">
        <AnimatePresence mode="wait">
          {modo === "pastas"
            ? pastasFiltradas.map((pasta) => {
              const aberta =
                pastasAbertas[pasta.id] ||
                (searchQuery && pasta.documentos.length > 0);
              return (
                <motion.div
                  key={pasta.id}
                  className="folder-block"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="folder-header"
                    onClick={() => togglePasta(pasta.id)}
                  >
                    <div className="flex-row">
                      <Icons.Folder size={20} className="icons" />
                      {!folderSlide && <h3 className="FolderListH3" style={{ fontSize: "var(--font-size-base)" }}>{pasta.name}</h3>}
                    </div>
                    {!folderSlide && (
                      <div className="folder-info">
                        <span className="doc-count">
                          {pasta.documentos.length}
                        </span>
                        {aberta ? (
                          <Icons.ArrowUp size={16} />
                        ) : (
                          <Icons.ArrowDown size={16} />
                        )}
                      </div>
                    )}
                  </div>
                  {!folderSlide && aberta && (
                    <motion.div
                      className="documents-list"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {loading ? (
                        <p>Carregando...</p>
                      ) : pasta.documentos.length === 0 ? (
                        <p className="empty-text">Sem arquivos nesta pasta</p>
                      ) : (
                        pasta.documentos.map((doc) => (
                          <motion.div
                            key={doc.id}
                            className="document-item"
                            onClick={() => {
                              handleDocumentClick(doc);
                            }}
                            whileHover={{ x: 4 }}
                          >
                            <Icons.DocumentText size={18} className="icons" />
                            <span>
                              {(doc.resolvedTemplate || doc.name).length > 20
                                ? (doc.resolvedTemplate || doc.name).slice(
                                  0,
                                  20
                                ) + "..."
                                : doc.resolvedTemplate || doc.name}
                            </span>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })
            : documentosFiltrados.map((doc) => (
              <motion.div
                key={doc.id}
                className="document-item"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                whileHover={{ x: 4 }}
                onClick={() => {
                  handleDocumentClick(doc);
                }}
              >
                <div className="documents-scroll">
                  <div className="documents-content">
                    <>
                      {(() => {
                        const IconComponent =
                          Icons[pastasFiltradas[doc.pastaId]?.model];
                        return IconComponent ? (
                          <IconComponent
                            size={50}
                            className="icons-pasta-dashboard"
                          />
                        ) : null;
                      })()}
                      <h4>
                        {(doc.templateName || doc.name).length > 25
                          ? (doc.templateName || doc.name).slice(0, 25) +
                          "..."
                          : doc.templateName || doc.name}
                      </h4>
                    </>

                    <Icons.ArrowRight size={18} className="icons" />
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <div>
        {/* Documentos recentes */}
        <div className="flex-row recent-docs-header" onClick={() => setViewRecentDocs((prev) => !prev)}>
          <h3>Documentos Recentes</h3>
          <Icons.ArrowDown size={20} />
        </div>

        {viewRecentDocs && (
          <motion.div
            className="recent-docs"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="activity-list">
              {recentDocuments.length ? recentDocuments.map((doc, index) => {
                const date = new Date(doc.createdAt).toLocaleDateString("pt-BR");
                return (
                  <div key={index} className="recent-doc-item" onClick={() => handleDocumentClick(doc)} title={`Clique para ver detalhes de ${doc.templateName}`}>
                    <div className="recent-doc-info">
                      <span className="recent-doc-name">{doc.templateName}</span>
                      <span className="recent-doc-date">{date}</span>
                    </div>
                    <Icons.ArrowRight size={14} />
                  </div>
                );
              }) : <p className="no-docs">Nenhum documento recente</p>}
            </div>
          </motion.div>

        )}
      </div>
    </motion.div>
  );
}

export default FoldersAction;
