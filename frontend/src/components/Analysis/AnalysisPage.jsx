import { useEffect, useState, useMemo, useRef } from "react";
import { Icons } from "../../constants/icons";
import SearchBar from "../bars/searchBar/searchbar";
import axios from "axios";
import "../tools/analyse/analysis.css";
import { motion, AnimatePresence } from "framer-motion";

import EditVariables from "./editContents/edit-variables";
import EditEtapas from "./editContents/edit-etapas";

// ==========================================================================
// SUB-COMPONENTE PARA A TELA DE SELEÇÃO DE MODELO (REFATORADO)
// ==========================================================================
const ModelSelectionScreen = ({
  tags,
  modelos,
  onModelSelect,
  searchQuery,
  setSearchQuery,
  setTool,
  handleScrollTo,
  documentos,
  onToggleFavorite, // Recebe a função
  favoriteModelIds, // Recebe a lista de IDs
  showAlert // Recebe a função showAlert
}) => {
  const [seeModels, setSeeModels] = useState(false);

  // Lógica de Autocomplete e Sugestão
  const suggestion = useMemo(() => {
    if (!searchQuery) return "";
    const queryLower = searchQuery.toLowerCase();
    const match = modelos.find(model =>
      model.name.toLowerCase().startsWith(queryLower)
    );
    if (match && match.name.toLowerCase() !== queryLower) {
      return match.name.substring(searchQuery.length);
    }
    return "";
  }, [searchQuery, modelos]);

  // Filtra os modelos para a lista
  const filteredModelos = useMemo(() =>
    modelos.filter(model =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [modelos, searchQuery]);

  const handleEditClick = (e, modelName) => {
    e.stopPropagation();
    setTool(3);
    handleScrollTo("Modelos");
  };

  // Ações sugeridas (favoritos) são geradas dinamicamente
  const suggestedActions = useMemo(() =>
    modelos
      .filter(m => favoriteModelIds.includes(m.id))
      .map(model => ({
        id: model.id,
        label: `Analisar ${model.name}`,
        icon: <Icons.Star size={14} />,
        action: () => onModelSelect(model)
      })),
    [modelos, favoriteModelIds, onModelSelect]
  );

  const createModelAction = {
    label: "Criar Novo Modelo",
    icon: <Icons.Add size={14} />,
    action: () => { setTool(3); handleScrollTo("Modelos"); }
  };

  // Lógica de clique no favorito (agora também mostra o alerta)
  const handleFavoriteClick = (e, modelId) => {
    e.stopPropagation();
    const isCurrentlyFavorite = favoriteModelIds.includes(modelId);

    // ✨ CORREÇÃO: Mostra o alerta correto ANTES de trocar o estado
    if (!isCurrentlyFavorite) {
      showAlert("success", `Modelo salvo em favoritos!`);
    } else {
      showAlert("info", `Modelo removido dos favoritos.`);
    }
    onToggleFavorite(modelId);
  };

  // Lógica para lidar com Tab e Enter na barra de busca
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      setSearchQuery(searchQuery + suggestion);
    }
    if (e.key === 'Enter' && (searchQuery + suggestion)) {
      e.preventDefault();
      const fullMatch = searchQuery + suggestion;
      const modelToSelect = modelos.find(m => m.name.toLowerCase() === fullMatch.toLowerCase());
      if (modelToSelect) {
        onModelSelect(modelToSelect);
      }
    }
  };

  const showModelList = searchQuery.length > 0 || seeModels;

  const listVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <div className="model-selection-page">
      <header className="model-selection-header">
        <h1>O que vamos analisar hoje?</h1>
        <p>Você tem <span className="highlight-text">{modelos.length} modelos</span> e <span className="highlight-text">{tags.length} tags</span> prontas para uso.</p>
      </header>

      <div className="model-search-bar">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Buscar modelo (ex: Despacho) e pressionar Enter"
          suggestion={suggestion} // ✨ Passa a sugestão para o SearchBar
          onKeyDown={handleSearchKeyDown} // ✨ Passa a função de keydown
        />
      </div>

      <div className="toggle-view-actions">
        <button className="btn-text" onClick={() => setSeeModels(!seeModels)}>
          {showModelList ? <Icons.Close size={14} /> : <Icons.FileList size={14} />}
          {showModelList ? "Ocultar Modelos" : "Ver Todos os Modelos"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showModelList ? (
          <motion.div
            key="model-list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ width: "100%" }}
          >
            {filteredModelos.length > 0 ? (
              <div className="model-grid-results">
                {filteredModelos.map((model) => {
                  const isFavorite = favoriteModelIds.includes(model.id);
                  return (
                    <button
                      key={model.id}
                      className="model-card"
                      onClick={() => onModelSelect(model)}
                      title={model.description || `Selecionar modelo ${model.name}`}
                    >
                      <div className="model-card-content">
                        <Icons.ScannerDocument size={15} />
                        <h4>{model.name}</h4>
                      </div>
                      <div className="model-card__actions">
                        <button
                          className={`model-card__favorite-btn ${isFavorite ? 'is-favorite' : ''}`}
                          title={isFavorite ? "Remover favorito" : `Favoritar ${model.name}`}
                          onClick={(e) => handleFavoriteClick(e, model.id)}
                        >
                          <Icons.Star size={18} />
                        </button>
                        <button
                          className="model-card__edit-btn"
                          title={`Editar ${model.name}`}
                          onClick={(e) => handleEditClick(e, model.name)}
                        >
                          <Icons.EditNote size={18} />
                        </button>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="empty-state-container">
                <Icons.Search size={40} />
                <h4>Nenhum modelo encontrado para "{searchQuery}"</h4>
                <p>Tente ajustar sua busca ou adicione novos modelos no painel de gerenciamento.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="suggestions"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="suggested-actions">
              {suggestedActions.map((action) => (
                <button key={action.label} className="action-pill favorite" onClick={action.action}>
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
              <button className="action-pill" onClick={createModelAction.action}>
                {createModelAction.icon}
                <span>{createModelAction.label}</span>
              </button>
            </div>

            <footer className="model-selection-footer">
              <div className="stats-card-row">
                <div className="stats-card">
                  <h4>Documentos Analisados</h4>
                  <div className="stats-card__chart-bar">
                    <div className="bar-fill" style={{ width: `${Math.min(documentos.length * 10, 100)}%` }}></div>
                    <span className="stats-card__value">
                      <h5>{documentos.length} documentos foram analisados</h5>
                    </span>
                  </div>
                </div>
                <div className="stats-card">
                  <header><h4>Precisão Média</h4></header>
                  <div className="flex-row">
                    <div className="stats-card__chart-pie" style={{ "--p": 92 }}>92%</div>
                    <span className="stats-card__value"><h5>Taxa de acerto ao atingir os dados</h5></span>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ==========================================================================
// COMPONENTE PRINCIPAL (AnalysisPage)
// ==========================================================================
function AnalysisPage({
  modelos,
  etapas,
  tags,
  pastas,
  user,
  selectedModel,
  setSelectedModel,
  etapaAtual,
  setEtapaAtual,
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  tremer,
  setDocSelecionado,
  documentos,
  setDocumentos,
  setTool,
  handleScrollTo,
  erroArquivo,
  isEtapaDisabled,
  onBlocked,
  showAlert,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const [favoriteModelIds, setFavoriteModelIds] = useState(() => {
    const savedFavorites = localStorage.getItem("salvadocs_favorite_models");
    return savedFavorites ? JSON.parse(savedFavorites) : (user?.favoriteModelIds || [1, 2]);
  });

  useEffect(() => {
    if (user?.favoriteModelIds) {
      setFavoriteModelIds(user.favoriteModelIds);
    }
  }, [user]);

  const handleToggleFavorite = async (modelId) => {
    const isCurrentlyFavorite = favoriteModelIds.includes(modelId);
    let newFavoriteIds;

    if (isCurrentlyFavorite) {
      newFavoriteIds = favoriteModelIds.filter(id => id !== modelId);
    } else {
      newFavoriteIds = [...favoriteModelIds, modelId];
    }
    setFavoriteModelIds(newFavoriteIds);
    localStorage.setItem("salvadocs_favorite_models", JSON.stringify(newFavoriteIds));

    try {
      await axios.post(`/modelos/${modelId}/toggle-favorite`);
    } catch (error) {
      showAlert("error", "Erro ao atualizar favoritos.");
      setFavoriteModelIds(favoriteModelIds);
      localStorage.setItem("salvadocs_favorite_models", JSON.stringify(favoriteModelIds));
    }
  };

  const handleCloseEditor = () => {
    setSelectedModel(null);
    setSelectedTags([]);
    setFile(null);
    setEtapaAtual(1);
  };

  const goToEtapa = (targetId) => {
    if (targetId === 3 && !file) {
      onBlocked();
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, etapas.length)));
  };

  const handleModelSelection = async (model) => {
    if (!model) return;
    try {
      const response = await axios.get(`/modelos/${model.id}`);
      const tagsDoModelo = response.data.tagsBase || [];
      const idsDasTagsDoModelo = tagsDoModelo.map(tag => tag.id);
      setSelectedTags(idsDasTagsDoModelo);
      setSelectedModel(model);
    } catch (error) {
      console.error("Erro ao buscar as tags do modelo:", error);
      showAlert("error", `Não foi possível carregar as tags para o modelo ${model.name}.`);
    }
  };

  return (
    selectedModel ? (
      // --- TELA 2: Editor de Análise ---
      <div className="analysis-editor-screen">
        <div className="analysis-editor__main-content">
          <EditVariables
            etapas={etapas}
            etapaAtual={etapaAtual}
            setEtapaAtual={goToEtapa}
            selectedModel={selectedModel}
            onClose={handleCloseEditor}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            file={file}
            setFile={setFile}
            erroArquivo={erroArquivo}
            showAlert={showAlert}
            setDocSelecionado={setDocSelecionado}
            tags={tags}
            setDocumentos={setDocumentos}
            setTool={setTool}
            user={user}
            pastas={pastas}
            modelos={modelos}
          />
        </div>
        <div className="analysis-editor__sidebar">
          <EditEtapas
            etapas={etapas}
            etapaAtual={etapaAtual}
            setEtapaAtual={goToEtapa}
            tremer={tremer}
            handleClick={goToEtapa}
            isEtapaDisabled={isEtapaDisabled}
            file={file}
            showAlert={showAlert}
          />
        </div>
      </div>
    ) : (
      // --- TELA 1: Seleção de Modelo (Novo Design) ---
      <ModelSelectionScreen
        tags={tags}
        documentos={documentos}
        modelos={modelos}
        onModelSelect={handleModelSelection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setTool={setTool}
        showAlert={showAlert}
        handleScrollTo={handleScrollTo}
        onToggleFavorite={handleToggleFavorite}
        favoriteModelIds={favoriteModelIds}
      />
    )
  );
}

export default AnalysisPage;