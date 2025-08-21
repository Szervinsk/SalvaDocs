import { useState } from "react";
import { LuFileSearch } from "react-icons/lu";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import EditVariables from "./edit-variables";
import EditEtapas from "./edit-etapas";
import OpenDocs from "./open-docs";

function AnalisarArquivos({
  modelos,
  selectedModel,
  setSelectedModel,
  etapas,
  etapaAtual,
  setEtapaAtual, // agora é o goToEtapa
  selectedTags,
  setSelectedTags,
  file,
  setFile,
  anexou,
  setAnexou,
  erroArquivo,
  onBlocked, // novo
  alert,
  setAlert,
  setTremer,
  tremer,
  closeAlert,
  setCloseAlert,
}) {
  const defaultMessage =
    "Use o modelo Despachos para análise automatizada de documentos.";

  const [text, setText] = useState(defaultMessage);
  const [isResponse, setIsResponse] = useState(false);
  const [resultados, setResultados] = useState(null);

  // Tags que sempre aparecem em qualquer documento
  const tagsUniversais = [
    {
      id: 1,
      content: "SEI",
      type: "regex",
      regex: "\\bSEI\\s*(\\d{5}-\\d{8}/\\d{4}-\\d{2})\\b",
    },
    {
      id: 2,
      content: "Gdoc",
      type: "regex",
      regex:
        "\\b(?:GDOC|Doc. Id.|Doc. SEI(?:/GDF)?)s*(?:n[º°]?s*)?(d{6,}|d+/d{4})",
    },
    {
      id: 3,
      content: "Data",
      type: "regex",
      regex: "\\b\\d{1,2} de [a-zç]+ de \\d{4}\\b",
    },
    {
      id: 4,
      content: "Destinatários",
      type: "regex",
      regex: "(?:Para|À)\\s*[:\\-]?\\s*(.+?)[,;\\n]", // baseado em extrair_despacho
    },
    {
      id: 5,
      content: "Documentos referenciados",
      type: "regex",
      regex:
        "\\b(Lei|Portaria CGDF|Portaria|Decreto|Resolução|Decisão|Relatório)\\b", // baseado em extrair_dados
    },
  ];

  // Tags que dependem de interpretação do texto (IA)
  const tagsIA = [
    {
      id: 6,
      content: "Resumo",
      type: "ia",
      prompt: "Resuma os parágrafos em um parágrafo",
    },
    {
      id: 7,
      content: "Título",
      type: "ia",
      prompt: "Gere um título contendo o documento principal",
    },
  ];

  // Tags para pareceres
  const tagsParecer = [
    {
      id: 8,
      content: "Resumo Parecer",
      type: "ia",
      prompt: "Pegue o 1. Histórico + Conclusão e resuma",
    },
    {
      id: 9,
      content: "Número do Parecer",
      type: "regex",
      regex: "PARECER\\s*n[º°]?\\s*(\\d+/\\d+)",
    },
    {
      id: 10,
      content: "Norma/Política/Regimento",
      type: "regex",
      regex: "\\b(?:PL|ND|RG)\\.[0-9-]+\\b",
    },
    {
      id: 11,
      content: "Nome da Norma/Política/Instrução",
      type: "ia",
      prompt: "Extraia o nome da norma/regimento",
    },
  ];

  // Tags para programas de integridade
  const tagsPrograma = [
    {
      id: 12,
      content: "Assunto",
      type: "regex",
      regex: "Assunto\\s*[:\\-]?\\s*(.+?)(?:\\n|$)", // baseado em extrair_dados
    },
    {
      id: 13,
      content: "Contrato",
      type: "regex",
      regex: "Contrato\\s*n[º°]?\\s*(\\d+/?\\d{0,4})", // suporta "123/2025" ou apenas "123"
    },
    {
      id: 14,
      content: "ARP",
      type: "regex",
      regex: "(?:ARP|Ata de Registro de Preços)\\s*n[º°]?\\s*(\\d+/?\\d{0,4})", // baseado em extrair_dados
    },
    {
      id: 15,
      content: "Valor",
      type: "regex",
      regex: "R\\$\\s*[0-9\\.,]+", // baseado em extrair_dados
    },
    {
      id: 16,
      content: "Pontuação",
      type: "regex",
      regex: "\\bPontuação\\s*[:\\-]?\\s*(\\d+)\\b", // exemplo genérico
    },
    {
      id: 17,
      content: "Empresa",
      type: "regex",
      regex: "empresa\\s+([A-Za-zÀ-ÿ\\s]+?(?:LTDA\\.?|Ltda\\.?|S/A|S\\.A))",
    },
    {
      id: 18,
      content: "Diretoria",
      type: "regex",
      regex: "Diretoria\\s+de\\s+[A-Za-z\\s]+-\\s*(DP|DE|DS|PR|DC)",
    },
    {
      id: 19,
      content: "Decisão",
      type: "regex",
      regex: "Decisão*n[º°]?s*(d+/d{4})",
    },
  ];

  const handleCloseModal = () => {
    setSelectedModel(null);
    setIsResponse(null); // volta pro estado inicial
  };

  const handleModelText = (id) => {
    const model = modelos.find((m) => m.id === id);
    if (model)
      setText(
        `Use o modelo ${model.text} para análise automatizada de documentos.`
      );
  };

  // Se um modelo foi selecionado, exibe o modal de edição
  if (isResponse) {
    return (
      <OpenDocs
        onClose={handleCloseModal}
        resultados={resultados}
        selectedTags={selectedTags}
        selectedModel={selectedModel}
        tagsUniversais={tagsUniversais}
        tagsParecer={tagsParecer}
        tagsPrograma={tagsPrograma}
        tagsIA={tagsIA}
      />
    );
  } else if (selectedModel !== null) {
    return (
      <div className="flex-left-right , spc-bet">
        <EditVariables
          etapas={etapas}
          etapaAtual={etapaAtual}
          modelId={selectedModel}
          onClose={handleCloseModal}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          file={file}
          setFile={setFile}
          anexou={anexou}
          setAnexou={setAnexou}
          erroArquivo={erroArquivo}
          setIsResponse={setIsResponse}
          setResultados={setResultados}
          tagsUniversais={tagsUniversais}
          tagsParecer={tagsParecer}
          tagsPrograma={tagsPrograma}
          tagsIA={tagsIA}
        />

        <EditEtapas
          etapas={etapas}
          etapaAtual={etapaAtual}
          setEtapaAtual={setEtapaAtual} // usa o guardado
          anexou={anexou} // para UI desabilitar
          alert={alert}
          setAlert={setAlert}
          tremer={tremer}
          setTremer={setTremer}
          closeAlert={closeAlert}
          setCloseAlert={setCloseAlert}
        />
      </div>
    );
  }

  return (
    <div className="AnalisaArquivos">
      <LuFileSearch size={30} className="icons" />
      <h2>Analisador de arquivos</h2>
      <h3>Selecione abaixo o modelo de captura de dados desejado</h3>

      <div className="flex-left-right">
        {modelos.map((model) => (
          <div
            key={model.id}
            className="Models-btn"
            onMouseEnter={() => handleModelText(model.id)}
            onMouseLeave={() => setText(defaultMessage)}
            onClick={() => setSelectedModel(model.text)}
          >
            <MdOutlineDocumentScanner size={20} className="icons" />
            <h3>{model.text}</h3>
          </div>
        ))}
      </div>

      <div className="Models-text">
        <FaRegLightbulb size={20} className="icons" />
        <p>{text}</p>
      </div>
    </div>
  );
}

export default AnalisarArquivos;
