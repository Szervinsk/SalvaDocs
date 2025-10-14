import SearchBar from "../searchBar/searchbar";
import { useState, useEffect } from "react";
import { Icons } from "../../../constants/icons";
import { motion, AnimatePresence } from "framer-motion";
import "./library.css";
import axios from "axios";

// ==========================================================================
// SUB-COMPONENTES INTERNOS (Tudo em um só lugar)
// ==========================================================================

// --- Sub-componente para exibir um único item de documento ---
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

// --- Sub-componente para exibir um bloco de pasta ---
const FolderBlock = ({ pasta, docSelecionado, onDocClick, abrirPastaSeFiltrada }) => {
  const [isAberta, setIsAberta] = useState(false);

  // Abre a pasta automaticamente se a busca encontrar documentos dentro dela
  useEffect(() => {
    if (abrirPastaSeFiltrada) {
      setIsAberta(true);
    }
  }, [abrirPastaSeFiltrada]);
  
  return (
    <div className="folder-block">
      <div
        className={`folder-header ${isAberta ? "active" : ""}`}
        onClick={() => setIsAberta(prev => !prev)}
      >
        <div className="folder-info">
          <Icons.Folder size={20} />
          <h3>{pasta.name}</h3>
        </div>
        <div className="folder-info">
          <span className="doc-count">{pasta.documentos.length}</span>
          <Icons.ArrowDown size={16} className={`arrow-icon ${isAberta ? "rotated" : ""}`} />
        </div>
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
            {/* Adicionada a mensagem para quando não há documentos */}
            {pasta.documentos.length > 0 ? (
              pasta.documentos.map((doc) => (
                <DocumentItem 
                  key={doc.id} 
                  doc={doc} 
                  docSelecionado={docSelecionado} 
                  onClick={onDocClick} 
                />
              ))
            ) : (
              <p className="empty-text">Nenhum documento nesta pasta.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ==========================================================================
// COMPONENTE PRINCIPAL
// ==========================================================================

function FoldersAction({ setDocSelecionado, docSelecionado, pastas, setPastas }) {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReduzido, setIsReduzido] = useState(false);

  // Busca os dados iniciais da API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pastasRes, documentosRes] = await Promise.all([
          axios.get("http://localhost:5000/api/folders"),
          axios.get("http://localhost:5000/api/files/documentos"),
        ]);
        setPastas(pastasRes.data);
        setDocumentos(documentosRes.data);
      } catch (error) {
        console.error("Erro ao buscar dados da biblioteca:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDocumentClick = (doc) => {
    setDocSelecionado(prev => (prev?.id === doc.id ? null : doc));
  };
  
  // Lógica de filtragem e combinação dos dados
  const pastasComDocumentosFiltrados = pastas
    .map(pasta => {
      const docsNestaPasta = documentos.filter(doc => 
        doc.folderId === pasta.id &&
        (doc.resolvedTemplate || doc.templateName || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...pasta, documentos: docsNestaPasta };
    })
    .filter(pasta => 
      // A pasta só será removida da lista se o NOME dela não corresponder à busca.
      pasta.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <motion.div
      className={`sidebar ${isReduzido ? "reduzido" : ""}`}
      animate={{ width: isReduzido ? 70 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Cabeçalho */}
      <div className="sidebar-header">
        {!isReduzido && <h2>Biblioteca</h2>}
        <button className="icon-btn" onClick={() => setIsReduzido(prev => !prev)} title={isReduzido ? "Expandir" : "Reduzir"}>
          <Icons.BackIn size={20} />
        </button>
      </div>

      {/* Busca */}
      {!isReduzido && (
        <div className="sidebar-controls">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Buscar pastas ou docs..."
          />
        </div>
      )}

      {/* Lista de Pastas */}
      <div className="folders-list">
        {loading ? (
          <p className="loading-text">Carregando...</p> 
        ) : pastasComDocumentosFiltrados.length > 0 ? (
          pastasComDocumentosFiltrados.map((pasta) => {
            const deveAbrir = searchQuery.length > 0 && pasta.documentos.length > 0;
            return (
              <FolderBlock 
                key={pasta.id} 
                pasta={pasta} 
                docSelecionado={docSelecionado} 
                onDocClick={handleDocumentClick}
                abrirPastaSeFiltrada={deveAbrir}
              />
            );
          })
        ) : (
          <p className="empty-text">Nenhuma pasta encontrada.</p>
        )}
      </div>
    </motion.div>
  );
}

export default FoldersAction;