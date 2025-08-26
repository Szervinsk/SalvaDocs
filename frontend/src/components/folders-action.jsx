import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TOOLS } from "../constants/constants";
import { Icons } from "../constants/icons";
import axios from "axios";
import Logo from "../assets/pen.svg";
import SearchBar from "../components/searchbar";

function FoldersAction({
  pastas,
  documentos,
  setDocumentos,
  setDocSelecionado,
  setTool,
}) {
  const [pastasAtivas, setPastasAtivas] = useState({});
  const [toolsAtivos, setToolsAtivos] = useState({});
  const [reduzido, setReduzido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchDocumentos = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/files/documentos"
        );
        setDocumentos(response.data);
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
    setPastasAtivas((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleTool = (index) =>
    setToolsAtivos((prev) => ({ ...prev, [index]: !prev[index] }));

  // Filtra pastas/documentos pelo termo de pesquisa
  const pastasFiltradas = pastas
    .map((pasta) => {
      const docsDaPasta = documentos.filter(
        (doc) =>
          doc.model === pasta.name &&
          (doc.templateName || doc.name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      if (docsDaPasta.length > 0 || pasta.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return { ...pasta, documentos: docsDaPasta };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <motion.div
      className={`Pastas ${reduzido ? "reduzido" : ""}`}
      animate={{ width: reduzido ? 80 : 320, alignItems: reduzido ? "center" : "stretch" }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex-left-right businessCard">
        <div className="icon-pen">
          <img src={Logo} alt="Ícone" />
        </div>
        {!reduzido && (
          <div className="flex-top-down conteudo-colapsavel">
            <h2>Empresa</h2>
            <h3>sla</h3>
          </div>
        )}
      </div>

      {/* Botão reduzir */}
      <div
        className="slide-folder"
        style={{
          display: "flex",
          justifyContent: reduzido ? "center" : "space-between",
          alignItems: "center",
          padding: "8px",
        }}
      >
        {!reduzido && <h3 className="conteudo-colapsavel">Visualizar pastas</h3>}
        <Icons.ArrowLeft
          size={20}
          className="icons"
          onClick={toggleReducao}
          style={{ cursor: "pointer" }}
          title={reduzido ? "Expandir" : "Reduzir"}
        />
      </div>

      {/* Search */}
      {!reduzido ? (
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      ) : (
        <div className="search-container">
          <Icons.Search size={20} className="search-icon" />
        </div>
      )}

      {/* Tools e Pastas */}
      <div className="folders" style={{ overflowY: "auto", maxHeight: 400 }}>
        {TOOLS.map((tool, index) => (
          <div key={index}>
            <div
              className="tools-title"
              onClick={() => {
                toggleTool(index);
                if (index === 0) setPastasAtivas({}); // reset pastas quando abre a primeira tool
                setTool(index);
              }}
              style={{ justifyContent: reduzido ? "center" : "flex-start" }}
            >
              {tool.icon && (() => {
                const IconComponent = Icons[tool.icon];
                return <IconComponent size={20} className="icons" />;
              })()}
              {!reduzido && <h3>{tool.name}</h3>}
            </div>

            {/* Conteúdo expandido da tool */}
            {toolsAtivos[index] && index === 0 && (
              <div>
                {pastasFiltradas.map((pasta) => {
                  const pastaAberta =
                    pastasAtivas[pasta.id] || (searchQuery && pasta.documentos.length > 0);

                  return (
                    <div key={pasta.id} className="folder-container">
                      <div
                        className="flex-left-right folder"
                        onClick={() => togglePasta(pasta.id)}
                        style={{ justifyContent: reduzido ? "center" : "space-between" }}
                      >
                        <div className="folder" style={{ cursor: "pointer" }}>
                          <Icons.Folder size={20} className="icons" />
                          {!reduzido && <h3>{pasta.name}</h3>}
                        </div>

                        {!reduzido && (
                          <div className="icon">
                            <div className="lengthDocs">{pasta.documentos.length}</div>
                            {pastaAberta ? (
                              <Icons.ArrowUp size={20} className="icons" />
                            ) : (
                              <Icons.ArrowDown size={20} className="icons" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Documentos */}
                      {!reduzido && pastaAberta && (
                        <div className="documents">
                          {loading ? (
                            <p>Carregando...</p>
                          ) : pasta.documentos.length === 0 ? (
                            <h3 className="document-item">Sem arquivos nesta pasta</h3>
                          ) : (
                            pasta.documentos.map((doc) => (
                              <div
                                key={doc.id}
                                className="document-item"
                                style={{ cursor: "pointer" }}
                                onClick={() => (setDocSelecionado(doc) , setTool(1))}
                              >
                                <Icons.DocumentText size={20} className="icons" />
                                <h3>
                                  {(doc.templateName || doc.name).length > 25
                                    ? (doc.templateName || doc.name).slice(0, 25) + "..."
                                    : doc.templateName || doc.name}
                                </h3>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default FoldersAction;
