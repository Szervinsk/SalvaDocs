import { useState } from "react";
import { Icons } from "../../constants/icons";
import SearchBar from "../bars/searchBar/searchbar";
import axios from "axios";

import EditVariables from "./editContents/edit-variables";
import EditEtapas from "./editContents/edit-etapas";

// ==========================================================================
// SUB-COMPONENTE PARA A TELA DE SELEÇÃO DE MODELO
// ==========================================================================
const ModelSelectionScreen = ({ modelos, onModelSelect, searchQuery, setSearchQuery }) => {
  // Filtra os modelos em tempo real com base na busca do usuário
  const filteredModelos = modelos.filter(model =>
    model.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div
              key={model.id}
              className="model-card"
              onClick={() => onModelSelect(model)}
            >
              <div className="flex-row space-between">
                <div className="model-card__icon">
                  <Icons.ScannerDocument size={24} />
                </div>
                <p>{model.tagsBase.length} tags</p>
              </div>
              <div className="model-card__info">
                <h4>{model.name}</h4>
                <p>{model.description || "Modelo para extração de dados."}</p>
              </div>
            </div>
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
  // Ela busca as tags associadas àquele modelo e define os estados.
  const handleModelSelection = async (model) => {
    try {
      // Busca os detalhes do modelo, incluindo as tags associadas
      const response = await axios.get(`/modelos/${model.id}`);
      const tagsDoModelo = response.data.tagsBase || [];

      // Extrai apenas os IDs das tags e define o estado
      const idsDasTagsDoModelo = tagsDoModelo.map(tag => tag.id);
      setSelectedTags(idsDasTagsDoModelo);

      // Define o modelo selecionado, o que troca a visualização para a tela de edição
      setSelectedModel(model);

    } catch (error) {
      console.error("Erro ao buscar as tags do modelo:", error);
      showAlert("error", `Não foi possível carregar as tags para o modelo ${model.name}.`);
    }
  };

  // Renderização condicional: ou mostra a tela de seleção, ou a tela de edição
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
      />
    )
  );
}

export default AnalysisPage;