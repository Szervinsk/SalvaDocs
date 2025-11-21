import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "../../../constants/icons";
import "./home.css";
import SearchBar from "../../bars/searchBar/searchbar";
import Dashboard from "./dashboard"

// ==========================================================================
// SUB-COMPONENTE: TABELA DE DOCUMENTOS (AGORA COM STATUS E PROGRESSO)
// ==========================================================================
const ListaDocumentos = ({ documentos, pastas, modelos, handleDocumentClick, searchQuery, setSearchQuery, filtros, setFiltros }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [filterPasta, setFilterPasta] = useState('');
  const [filterModelo, setFilterModelo] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // Novo filtro de status

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredDocuments = useMemo(() =>
    [...documentos]
      .filter(doc => {
        const searchMatch = (doc.templateName || doc.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const pastaMatch = filterPasta ? doc.folder?.id === parseInt(filterPasta) : true;
        const modeloMatch = filterModelo ? doc.model === filterModelo : true;
        const statusMatch = filterStatus ? doc.status === filterStatus : true;
        return searchMatch && pastaMatch && modeloMatch && statusMatch;
      })
      .sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === 'folder') {
          valA = a.folder?.name || '';
          valB = b.folder?.name || '';
        }
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      })
    , [documentos, searchQuery, filterPasta, filterModelo, filterStatus, sortConfig]);

  // Componente para o badge de Status
  const StatusBadge = ({ status }) => (
    <span className={`status-badge status--${status?.toLowerCase()}`}>{status || "N/A"}</span>
  );

  // Componente para a barra de progresso das Tags
  const TagProgress = ({ found, total }) => {
    const percent = total > 0 ? (found / total) * 100 : 0;
    return (
      <div className="tag-progress-cell">
        <span className="tag-progress-text">{found}/{total}</span>
        <div className="tag-progress-bar">
          <div className="tag-progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      key="listas"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="content-card-section"
    >
      <div className="section-header list-header-top">
        <h3 className="section-title"><Icons.DocumentText size={18} /> Todos os Documentos</h3>
        <div className="header-actions">
          <div className="home-search small-search">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar documento..." />
          </div>
          <button className="section-filter-button" onClick={() => setFiltros((prev) => !prev)}><Icons.Filter size={14} /> {filtros ? "Esconder filtros" : "Exibir filtros"}</button>
        </div>
      </div>

      {filtros && (
        <>

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
            <div className="custom-select-wrapper">
              <select className="custom-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="">Todos os Status</option>
                <option value="Completo">Completo</option>
                <option value="Parcial">Parcial</option>
                <option value="Erro">Erro</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className="table-wrapper">
        <table className="documents-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')}>Nome</th>
              <th onClick={() => requestSort('folder')}>Pasta</th>
              <th onClick={() => requestSort('status')}>Status</th>
              <th>Progresso (Tags)</th>
              <th onClick={() => requestSort('createdAt')}>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedAndFilteredDocuments.map((doc) => (
              <tr key={doc.id} onClick={() => handleDocumentClick(doc)}>
                <td className="doc-name">{doc.name.slice(0,60) + "..."}</td>
                <td>{doc.folder ? <span className="doc-folder">{doc.folder.name}</span> : "-"}</td>
                <td><StatusBadge status={doc.status} /></td>
                <td><TagProgress found={doc.tagsFound} total={doc.tagsTotal} /></td>
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
  tags,
  modelos,
  setArea,
  loading,
  setDocSelecionado,
  setTool,
  dataView, 
  setDataView
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtros, setFiltros] = useState(false);

  const handleDocumentClick = (doc) => {
    setDocSelecionado(prev => (prev?.id === doc.id ? null : doc));
  };

  const stats = useMemo(() => {
    return {
      concluidos: documentos.filter(d => d.status === 'Completo').length,
      pendentes: documentos.filter(d => d.status === 'Parcial').length,
      comErro: documentos.filter(d => d.status === 'Erro').length,
    }
  }, [documentos]);

  return (
    <div className="home-container">
      {/* 1. BANNER DE NOVIDADES */}
      <div className="intro-banner">
        <span className="intro-banner-icon"><Icons.Lamp size={20} /></span>
        <p className="intro-banner-text">Novidade! Introduzindo o SalvaDocs AI 2.0: Análise 20% mais rápida e precisa. <a href="#">Saiba mais</a></p>
        <button className="intro-banner-close"><Icons.Close size={16} /></button>
      </div>

      {/* 2. CABEÇALHO PRINCIPAL */}
      <header className="home-header">
        <div className="header-left">
          <div className="welcome">
            <h1>Documentos</h1>
            <p className="subtitle">Explore, filtre e gerencie todo o seu histórico de extrações.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="action-button primary" onClick={() => setTool(2)}><Icons.Add size={16} /> Nova Análise</button>
        </div>
      </header>

      {/* 3. CARDS DE ESTATÍSTICAS (AGORA DINÂMICOS) */}
      <nav className="stats-nav">
        <div className="stats-tabs">
          <div className="stats-tab-item">
            <Icons.Check size={16} className="stats-icon status--completo" />
            <div className="stats-info">
              <span className="stats-label">Concluídos</span>
              <span className="stats-value">{stats.concluidos}</span>
            </div>
          </div>
          <div className="stats-tab-item">
            <Icons.Clock size={16} className="stats-icon status--parcial" />
            <div className="stats-info">
              <span className="stats-label">Parciais</span>
              <span className="stats-value">{stats.pendentes}</span>
            </div>
          </div>
          <div className="stats-tab-item">
            <Icons.AlertTriangle size={16} className="stats-icon status--erro" />
            <div className="stats-info">
              <span className="stats-label">Com Erro</span>
              <span className="stats-value">{stats.comErro}</span>
            </div>
          </div>
        </div>
        <div className="stats-analysis-link">
          <button className="btn-secondary" onClick={() => setDataView((prev) => !prev)}>{dataView ? "Ver tabela de modelos" : "Ver Análise Detalhada"}<Icons.ArrowRight size={14} /></button>
        </div>
      </nav>

      {/* 4. CONTEÚDO PRINCIPAL (A TABELA) */}
      <main className="home-main">
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="loading-container"><p className="loading-text">Carregando informações...</p></div>
          ) : (dataView ? (
            <Dashboard tags={tags} modelos={modelos} documentos={documentos} pastas={pastas} setArea={setArea} />
          ) : (
            <ListaDocumentos
              documentos={documentos}
              pastas={pastas}
              modelos={modelos}
              handleDocumentClick={handleDocumentClick}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filtros={filtros}
              setFiltros={setFiltros}
            />
          )
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Home;