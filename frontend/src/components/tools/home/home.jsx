import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "../../../constants/icons";
import "./home.css";
import SearchBar from "../../bars/searchBar/searchbar";

// ==========================================================================
// SUB-COMPONENTES PARA CADA ABA
// ==========================================================================

// --- ABA 1: VISÃO GERAL ---
const VisaoGeral = ({ documentos, setTool, setSelectedModel }) => (
  <motion.div
    key="visao-geral"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="home-section-container"
  >

    <section className="home-section">
      <h4>Atalhos Rápidos</h4>
      <div className="atalhos-container">
        <div className="atalho-card" onClick={() => setTool(3)}><Icons.Model size={25} /><h5>Gerenciar Conteúdo</h5><p>Edite modelos, tags e pastas.</p></div>
        <div className="atalho-card" onClick={() => setTool(2)}><Icons.ScannerDocument size={25} /><h5>Analisar Documento</h5><p>Inicie uma nova análise.</p></div>
        <div className="atalho-card" onClick={() => setTool(4)}><Icons.Adjustments size={25} /><h5>Configurações</h5><p>Personalize sua experiência.</p></div>
      </div>
    </section>

    <section className="home-section">
      <h4>Atividade Recente</h4>
      <div className="activity-list">
        {documentos.length > 0 ? (
          documentos.slice(0, 3).map((doc) => (
            <div key={doc.id} className="activity-item">
              <div className="activity-icon"><Icons.Archive size={16} /></div>
              <div className="activity-content">
                <p><strong>{doc.templateName || doc.name}</strong> foi analisado</p>
                <span>{new Date(doc.createdAt).toLocaleString("pt-BR", { dateStyle: 'short', timeStyle: 'short' })}</span>
              </div>
            </div>
          ))
        ) : <p className="empty-text">Nenhuma atividade recente.</p>}
      </div>
    </section>
  </motion.div>
);


// --- ABA 2: DOCUMENTOS ---
const ListaDocumentos = ({ documentos, pastas, modelos, handleDocumentClick, searchQuery }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [filterPasta, setFilterPasta] = useState('');
  const [filterModelo, setFilterModelo] = useState('');

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredDocuments = [...documentos]
    .filter(doc => {
      const searchMatch = (doc.templateName || doc.name || "").toLowerCase().includes(searchQuery.toLowerCase());
      const pastaMatch = filterPasta ? doc.folder?.id === parseInt(filterPasta) : true;
      const modeloMatch = filterModelo ? doc.model === filterModelo : true;
      return searchMatch && pastaMatch && modeloMatch;
    })
    .sort((a, b) => {
      const valA = sortConfig.key === 'folder' ? a.folder?.name.toLowerCase() : (a[sortConfig.key] || '').toString().toLowerCase();
      const valB = sortConfig.key === 'folder' ? b.folder?.name.toLowerCase() : (b[sortConfig.key] || '').toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });

  return (
    <motion.div
      key="listas"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="list-documents-container"
    >
      <div className="list-filters">
        <div className="custom-select-wrapper">
          <select className="custom-select" value={filterPasta} onChange={e => setFilterPasta(e.target.value)}>
            <option value="">Todas as Pastas</option>
            {pastas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="custom-select-wrapper">
          <select className="custom-select" value={filterModelo} onChange={e => setFilterModelo(e.target.value)}>
            <option value="">Todos os Modelos</option>
            {modelos.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
      </div>
      <div className="table-wrapper">
        <table className="documents-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('templateName')}>Nome</th>
              <th onClick={() => requestSort('folder')}>Pasta</th>
              <th>Tags</th>
              <th onClick={() => requestSort('createdAt')}>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredDocuments.map((doc) => (
              <tr key={doc.id} onClick={() => handleDocumentClick(doc)}>
                <td className="doc-name">{doc.templateName || doc.name}</td>
                <td>{doc.folder ? <span className="doc-folder">{doc.folder.name}</span> : "-"}</td>
                <td><span className="tag-count">{doc.tags.length} tags</span></td>
                <td>{new Date(doc.createdAt).toLocaleDateString("pt-BR")}</td>
                <td>
                  <button className="icon-button" onClick={(e) => { e.stopPropagation(); handleDocumentClick(doc); }} title="Ver detalhes">
                    <Icons.ArrowRight size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};


// ==========================================================================
// COMPONENTE PRINCIPAL HOME
// ==========================================================================
function Home({
  user,
  documentos,
  pastas,
  modelos,
  loading,
  setDocSelecionado,
  setTool,
  setSelectedModel
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [option, setOption] = useState(1);

  const handleDocumentClick = (doc) => {
    setDocSelecionado(prev => (prev?.id === doc.id ? null : doc));
  };

  const getFriendlyDate = () => {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const HOME_TYPES = [
    { id: 1, name: "Visão Geral", icon: <Icons.Home size={16} /> },
    { id: 2, name: "Documentos", icon: <Icons.DocumentText size={16} /> },
  ];

  const renderContent = () => {
    if (loading) {
      return <div className="loading-container"><p className="loading-text">Carregando informações...</p></div>;
    }
    switch (option) {
      case 1:
        return <VisaoGeral documentos={documentos} setTool={setTool} setSelectedModel={setSelectedModel} />;
      case 2:
        return <ListaDocumentos
          documentos={documentos}
          pastas={pastas}
          modelos={modelos}
          handleDocumentClick={handleDocumentClick}
          searchQuery={searchQuery}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="welcome">
          <div className="account-img"></div>
          <div>
            <h2>Olá, {user?.username}!</h2>
            <h3>{getFriendlyDate()}</h3>
          </div>
        </div>
        {option === 2 && ( // ✨ Corrigido de option === 3 para option === 2 ✨
          <div className="home-search">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Pesquisar por nome ou pasta..." />
          </div>
        )}
      </header>

      <nav className="home-nav">
        {HOME_TYPES.map((type) => (
          <button
            key={type.id}
            className={`home-nav-btn ${option === type.id ? "active" : ""}`}
            onClick={() => setOption(type.id)}
          >
            {type.icon}
            <span>{type.name}</span>
          </button>
        ))}
      </nav>

      <main className="home-main">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Home;