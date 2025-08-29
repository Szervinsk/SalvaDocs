import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Icons } from "../constants/icons";
import "../styles/library.css";
import SearchBar from "../components/searchbar";

function FoldersAction({
  pastas,
  documentos,
  setDocumentos,
  setDocSelecionado,
  reduzido,
  setReduzido,
  setTool,
}) {
  const [pastasAbertas, setPastasAbertas] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modo, setModo] = useState("pastas"); // "pastas" | "modelos"

  useEffect(() => {
    const fetchDocumentos = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/files/documentos"
        );
        setDocumentos(data);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentos();
  }, [setDocumentos]);

  const toggleReducao = () => setReduzido((prev) => !prev);
  const togglePasta = (id) =>
    setPastasAbertas((prev) => ({ ...prev, [id]: !prev[id] }));

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
      className={`sidebar ${reduzido ? "reduzido" : ""}`}
      animate={{ width: reduzido ? 80 : 280 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header da Sidebar */}
      <div className="sidebar-header">
        {!reduzido && <h3>Acessar Pastas</h3>}
        <Icons.ArrowLeft
          size={20}
          className="icon-btn"
          onClick={toggleReducao}
          title={reduzido ? "Expandir" : "Reduzir"}
        />
      </div>

      {/* Toggle Pastas/Modelos */}
      {!reduzido && (
        <div className="mode-toggle">
          <div
            className="toggle-bg"
            style={{
              transform:
                modo === "modelos" ? "translateX(100%)" : "translateX(0)",
            }}
          />
          <label onClick={() => setModo("pastas")}>
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
          <label onClick={() => setModo("modelos")}>
            <input
              type="radio"
              name="mode"
              value="modelos"
              checked={modo === "modelos"}
              readOnly
              style={{ display: "none" }}
            />
            Documentos
          </label>
        </div>
      )}

      {/* Search */}
      {!reduzido ? (
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      ) : (
        <div className="search-container">
          <Icons.Search
            size={20}
            className="search-icon"
            style={{ margin: "auto" }}
          />
        </div>
      )}

      <hr />

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
                      <div className="flex-left-right">
                        <Icons.Folder size={20} className="icons" />
                        {!reduzido && <h3>{pasta.name}</h3>}
                      </div>
                      {!reduzido && (
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
                    {!reduzido && aberta && (
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
                              onClick={() => (
                                setTool(1), setDocSelecionado(doc)
                              )}
                              whileHover={{ x: 4 }}
                            >
                              <Icons.DocumentText size={18} className="icons" />
                              <span>
                                {(doc.templateName || doc.name).length > 25
                                  ? (doc.templateName || doc.name).slice(
                                      0,
                                      25
                                    ) + "..."
                                  : doc.templateName || doc.name}
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
                  onClick={() => (setTool(1), setDocSelecionado(doc))}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  whileHover={{ x: 4 }}
                >
                  <Icons.DocumentText size={18} className="icons" />
                  <span>
                    {(doc.templateName || doc.name).length > 25
                      ? (doc.templateName || doc.name).slice(0, 25) + "..."
                      : doc.templateName || doc.name}
                  </span>
                </motion.div>
              ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default FoldersAction;
