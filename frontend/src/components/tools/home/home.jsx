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
      <h4>Ações Recomendadas</h4>
      <div className="action-cards-container">
        <div className="action-card">
          <div className="action-card__icon" style={{backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#FFC107'}}><Icons.Retry size={20}/></div>
          <div className="action-card__info">
            <h5>1 Documento com Erro</h5>
            <p>Um documento falhou na última análise. Tente novamente.</p>
          </div>
          <button className="icon-button"><Icons.ArrowRight size={16}/></button>
        </div>
      </div>
    </section>

    <section className="home-section">
      <h4>Atalhos Rápidos</h4>
      <div className="atalhos-container">
        <div className="atalho-card" onClick={() => setTool(3)}><Icons.Model size={25} /><h5>Gerenciar Conteúdo</h5><p>Edite modelos, tags e pastas.</p></div>
        <div className="atalho-card" onClick={() => setTool(2)}><Icons.ScannerDocument size={25} /><h5>Analisar Documento</h5><p>Inicie uma nova análise.</p></div>
        <div className="atalho-card" onClick={() => { setTool(2); setSelectedModel({ name: "Despacho" }); }}><Icons.Send size={25} /><h5>Analisar Despacho</h5><p>Use o modelo mais popular.</p></div>
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

// --- ABA 2: GRÁFICOS ---
const Graficos = ({ documentos, modelos }) => {
  const COLORS = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];

  // Dados para Gráfico 1: Documentos nos últimos 7 dias
  const docsPorDia = Array(7).fill(0);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  documentos.forEach(doc => {
    const dataDoc = new Date(doc.createdAt);
    dataDoc.setHours(0, 0, 0, 0);
    const diffTime = hoje - dataDoc;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      docsPorDia[6 - diffDays]++;
    }
  });
  const maxDocsDia = Math.max(...docsPorDia) || 1;

  // Dados para Gráfico 2: Uso de Modelos
  const modelData = modelos.map(modelo => ({
    name: modelo.name,
    value: documentos.filter(doc => doc.model === modelo.name).length
  })).filter(p => p.value > 0).sort((a,b) => b.value - a.value);

  return (
    <motion.div
      key="graficos"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="charts-grid"
    >
      <div className="chart-card">
        <h4>Documentos por Dia (Últimos 7 dias)</h4>
        <div className="bar-chart">
          {docsPorDia.map((value, index) => (
            <div key={index} className="bar-chart__item">
              <div className="bar-chart__bar-wrapper" title={`${value} documentos`}>
                <div className="bar-chart__bar" style={{ height: `${(value / maxDocsDia) * 100}%` }}/>
              </div>
              <span className="bar-chart__label">
                {new Date(hoje.getTime() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="chart-card">
        <h4>Uso de Modelos</h4>
        <div className="legend-list">
          {modelData.map((item, index) => (
            <div key={item.name} className="legend-item">
              <div className="legend-color" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
              <span className="legend-label">{item.name}</span>
              <span className="legend-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- ABA 3: DOCUMENTOS ---
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
            const valA = sortConfig.key === 'folder' ? a.folder?.name.toLowerCase() : (a[sortConfig.key] || '').toLowerCase();
            const valB = sortConfig.key === 'folder' ? b.folder?.name.toLowerCase() : (b[sortConfig.key] || '').toLowerCase();

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
                    <select value={filterPasta} onChange={e => setFilterPasta(e.target.value)}>
                        <option value="">Todas as Pastas</option>
                        {pastas.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div className="custom-select-wrapper">
                    <select value={filterModelo} onChange={e => setFilterModelo(e.target.value)}>
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
    loading, // Recebe o estado de loading do pai
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
    { id: 2, name: "Gráficos", icon: <Icons.Graphics size={16} /> },
    { id: 3, name: "Documentos", icon: <Icons.DocumentText size={16} /> },
  ];

  const renderContent = () => {
    if (loading) {
        return <div className="loading-container"><p className="loading-text">Carregando informações...</p></div>;
    }
    switch(option) {
      case 1:
        return <VisaoGeral documentos={documentos} setTool={setTool} setSelectedModel={setSelectedModel} />;
      case 2:
        return <Graficos documentos={documentos} modelos={modelos} />;
      case 3:
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
        {option === 3 && (
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