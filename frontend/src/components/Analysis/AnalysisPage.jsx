import { useEffect, useState } from "react";
import { Icons } from "../../constants/icons";
import SearchBar from "../bars/searchBar/searchbar";
import axios from "axios";

import EditVariables from "./editContents/edit-variables";
import EditEtapas from "./editContents/edit-etapas";

// ==========================================================================
// SUB-COMPONENTE PARA A TELA DE SELEÇÃO DE MODELO
// ==========================================================================
const ModelSelectionScreen = ({ modelos, onModelSelect, searchQuery, setSearchQuery, setTool, handleScrollTo }) => {
  // Estado removido: const [showEditIcon, setShowEditIcon] = useState(null);

  // Filtra os modelos em tempo real com base na busca do usuário
  const filteredModelos = modelos.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Função para parar a propagação e navegar para a edição
  const handleEditClick = (e, modelName) => {
    e.stopPropagation(); // Impede que o clique no ícone selecione o modelo
    setTool(3);
    handleScrollTo("Modelos");
    // Futuramente, você pode passar o modelName para a página de gerenciamento
    // para que ela já abra este modelo para edição.
  };

  return (
    <div className="model-selection-page">
      <header className="model-selection-header">
        <h1>Comece uma Nova Análise</h1>
        <p>Selecione um modelo de extração para iniciar o processo.</p>
      </header>

      <div className="model-search-bar">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Buscar modelo..."
        />
      </div>

      {filteredModelos.length > 0 ? (
        <div className="model-grid">
          {filteredModelos.map((model) => (
            <button
              key={model.id}
              className="model-card"
              onClick={() => onModelSelect(model)}
              title={model.description || `Selecionar modelo ${model.name}`}
            >
              <div className="model-card-content">
                <div className="model-card__icon">
                  <Icons.ScannerDocument size={24} />
                </div>
                <div className="model-card__info">
                  <h4>{model.name}</h4>
                  <p>{model.tagsBase?.length || 0} tags</p>
                </div>
              </div>
              
              {/* Este ícone agora é controlado puramente por CSS */}
              <button 
                className="model-card__edit-btn" 
                title={`Editar ${model.name}`}
                onClick={(e) => handleEditClick(e, model.name)}
              >
                <Icons.EditNote size={18} />
              </button>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state-container">
          <Icons.Search size={40} />
          <h4>Nenhum modelo encontrado</h4>
          <p>Tente ajustar sua busca ou adicione novos modelos no painel de gerenciamento.</p>
        </div>
      )}
    </div>
  );
};


// ==========================================================================
// COMPONENTE PRINCIPAL (AnalyseDoc / AnalysisPage)
// ==========================================================================
function AnalysisPage({
  // Props de dados recebidas do componente pai (Block)
  modelos,
  etapas,
  tags,
  pastas,
  user,

  // Props de estado e setters
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
  setDocumentos,
  setTool,
  handleScrollTo, // Recebendo a função do EditModels

  // Props de controle de UI
  erroArquivo,
  isEtapaDisabled,
  onBlocked, // Renomeado para maior clareza, é o seu 'triggerShake'
  showAlert,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Função para limpar o estado da análise ao fechar
  const handleCloseEditor = () => {
    setSelectedModel(null);
    setSelectedTags([]);
    setFile(null);
    setEtapaAtual(1);
  };

  // Função para navegar entre as etapas com validação
  const goToEtapa = (targetId) => {
    if (targetId === 3 && !file) {
      onBlocked(); // Chama a função triggerShake do pai
      return;
    }
    setEtapaAtual(Math.max(1, Math.min(targetId, etapas.length)));
  };

  // Função chamada ao clicar em um card de modelo.
  const handleModelSelection = async (model) => {
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

  // Renderização condicional
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
          />
        </div>
      </div>
    ) : (
      // --- TELA 1: Seleção de Modelo ---
      <ModelSelectionScreen
        modelos={modelos}
        onModelSelect={handleModelSelection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setTool={setTool}
        handleScrollTo={handleScrollTo}
      />
    )
  );
}

export default AnalysisPage;