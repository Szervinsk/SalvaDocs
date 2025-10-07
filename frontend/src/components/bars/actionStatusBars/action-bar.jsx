import { Icons } from "../../../constants/icons";

// 1. Componente reutilizável para exibir informações
const InfoBlock = ({ title, icon, children }) => (
  <div className="info-block">
    <h4 className="info-block__title">{title}</h4>
    <div className="info-block__content">
      {icon}
      <h3 className="info-block__value">{children}</h3>
    </div>
  </div>
);

// Componente principal ActionBar
function ActionBar({
  docSelecionado,
  selectedModel,
  setDocSelecionado,
  selectedTags,
  etapaAtual,
  file,
  setMore,
  more,
  setTool,
  tool,
  searchQuery,
  setSearchQuery,
}) {
  
  // 2. Lógica de renderização movida para fora do JSX para maior clareza
  const renderInfoContent = () => {
    if (docSelecionado && !selectedModel && tool === 6) {
      return (
        <InfoBlock
          title="Arquivo selecionado"
          icon={<Icons.Selected size={16} className="icon--accent" />}
        >
          {docSelecionado.templateName || docSelecionado.name}
        </InfoBlock>
      );
    }

    if (selectedModel && !docSelecionado) {
      return (
        <InfoBlock
          title="Modelo em uso"
          icon={<Icons.Selected size={16} className="icon--accent" />}
        >
          Modelo {selectedModel.name}
        </InfoBlock>
      );
    }

    if (selectedModel && selectedTags?.length >= 1 && etapaAtual >= 2) {
      return (
        <InfoBlock
          title="Quantidade de tags"
          icon={<Icons.Tags size={16} className="icon--default" />}
        >
          {selectedTags.length} tags selecionadas
        </InfoBlock>
      );
    }
    
    if (etapaAtual === 3 && file) {
      return (
        <InfoBlock
          title="Arquivo para análise"
          icon={<Icons.FiFileText size={16} className="icon--accent" />}
        >
          {file.name}
        </InfoBlock>
      );
    }
    
    if (!docSelecionado && !selectedModel && tool !== 1) {
      return <h3 className="info-block__placeholder">Nenhuma seleção ativa</h3>;
    }

    // Retorna null ou um placeholder se nenhuma condição for atendida na Home (tool === 1)
    return <div className="info-block__placeholder--spacer" />;
  };

  return (
    <div className="action-bar">
      <div className="action-bar__info">
        {/* 3. Renderização simplificada */}
        {renderInfoContent()}
      </div>

      <div className="action-bar__actions">
        <button
          className="btn-secondary"
          title="Iniciar nova análise"
          onClick={() => {
            setDocSelecionado(null);
            setTool(2);
          }}
        >
          <Icons.Add size={20} />
        </button>

        <button
          className="btn-secondary"
          title="Mais opções"
          onClick={() => setMore(!more)}
        >
          <Icons.MdOutlineMoreHoriz size={20} />
        </button>
      </div>
    </div>
  );
}

export default ActionBar;