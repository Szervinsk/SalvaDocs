// Modelos disponíveis
export const MODELOS = [
  { id: 1, name: "Despacho" },
  { id: 2, name: "Programas" },
  { id: 3, name: "Parecer" },
];

// Tipos de documentos
export const TIPOS = [
  { id: "pdf", label: "PDF" },
  { id: "docx", label: "Word" },
  { id: "xlsx", label: "Excel" },
];

export const ALERTS = [
  { id: 1, type: "success", message: "Operação realizada com sucesso!" },
  { id: 2, type: "error", message: "Ocorreu um erro ao realizar a operação." },
  { id: 3, type: "warning", message: "Atenção: verifique os dados inseridos." },
];

export const TOOLS = [
  {id: 1, name:"Analisar Documentos", icon:"ScannerDocument"},
  {id: 2, name:"Editar Modelos", icon:"Model"},
  {id: 3, name:"Configurações", icon:"Adjustments"},
  {id: 4, name:"Sua Conta", icon:"User"},
]
// Pastas iniciais
export const PASTAS = [
  { id: 1, name: "Despacho" },
  { id: 2, name: "Programas" },
  { id: 3, name: "Parecer" },
];

// Tags gerais (despacho)
export const TAGS_UNIVERSAIS = [
  {
    id: 1,
    content: "SEI",
    icon: "Archive",
    type: "regex",
    regex: "\\b(?:SEI|NUP)\\s*(\\d{5}-\\d{8}/\\d{4}-\\d{2})",
  },
  {
    id: 2,
    content: "Gdoc",
    icon: "Archive",
    type: "regex",
    regex:
      "\\b(?:GDOC|Doc\\. Id\\.|Doc\\. SEI(?:/GDF)?)\\s*(?:n[º°]?\\s*)?(\\d{6,}|\\d+/\\d{4})"
  },
  {
    id: 3,
    content: "Data",
    icon: "Calendar",
    type: "regex",
    regex: "\\b\\d{1,2} de [a-zç]+ de \\d{4}\\b",
  },
  {
    id: 4,
    content: "Destinatários",
    icon: "Send",
    type: "regex",
    regex: "(?:Para|À)\\s*[:\\-]?\\s*(.+?)[,;\\n]", // baseado em extrair_despacho
  },
  {
    id: 5,
    content: "Documentos referenciados",
    icon: "DocumentText",
    type: "regex",
    regex:
      "\\b(Lei|Portaria CGDF|Portaria|Decreto|Resolução|Decisão|Relatório)\\b", // baseado em extrair_dados
  },
];

// Tags que dependem de interpretação do texto (IA)
export const TAGS_IA = [
  {
    id: 6,
    content: "Resumo",
    icon: "Summarize",
    type: "ia",
    prompt: "Resuma os parágrafos em um parágrafo",
  },
  {
    id: 7,
    content: "Título",
    icon: "Title",
    type: "ia",
    prompt: "Gere um título contendo o documento principal",
  },
];

// Tags para pareceres
export const TAGS_PARECER = [
  {
    id: 8,
    content: "Resumo Parecer",
    icon: "Summarize",
    type: "ia",
    prompt: "Pegue o 1. Histórico + Conclusão e resuma",
  },
  {
    id: 9,
    content: "Número do Parecer",
    icon: "Number",
    type: "regex",
    regex: "PARECER\\s*n[º°]?\\s*(\\d+/\\d+)",
  },
  {
    id: 10,
    content: "Norma/Política/Regimento",
    icon: "Law",
    type: "regex",
    regex: "\\b(?:PL|ND|RG)\\.[0-9-]+\\b",
  },
  {
    id: 11,
    content: "Nome da Norma/Política/Instrução",
    icon: "Law",
    type: "ia",
    prompt: "Extraia o nome da norma/regimento",
  },
];

// Tags para programas de integridade
export const TAGS_PROGRAMA = [
  {
    id: 12,
    content: "Assunto",
    icon: "Summarize",
    type: "regex",
    regex: "Assunto\\s*[:\\-]?\\s*(.+?)(?:\\n|$)", // baseado em extrair_dados
  },
  {
    id: 13,
    content: "Contrato",
    icon: "Hammer",
    type: "regex",
    regex: "Contrato\\s*n[º°]?\\s*(\\d+/?\\d{0,4})", // suporta "123/2025" ou apenas "123"
  },
  {
    id: 14,
    content: "ARP",
    icon: "Hammer",
    type: "regex",
    regex: "(?:ARP|Ata de Registro de Preços)\\s*n[º°]?\\s*(\\d+/?\\d{0,4})", // baseado em extrair_dados
  },
  {
    id: 15,
    content: "Valor",
    icon: "PigMoney",
    type: "regex",
    regex: "R\\$\\s*[0-9\\.,]+", // baseado em extrair_dados
  },
  {
    id: 16,
    content: "Pontuação",
    icon: "Score",
    type: "regex",
    regex: "\\bPontuação\\s*[:\\-]?\\s*(\\d+)\\b", // exemplo genérico
  },
  {
    id: 17,
    content: "Empresa",
    icon: "Document",
    type: "regex",
    regex: "empresa\\s+([A-Za-zÀ-ÿ\\s]+?(?:LTDA\\.?|Ltda\\.?|S/A|S\\.A))",
  },
  {
    id: 18,
    content: "Diretoria",
    icon: "People",
    type: "regex",
    regex: "Diretoria\\s+de\\s+[A-Za-z\\s]+-\\s*(DP|DE|DS|PR|DC)",
  },
  {
    id: 19,
    content: "Decisão",
    icon: "Hammer",
    type: "regex",
    regex: "Decisão*n[º°]?s*(d+/d{4})",
  },
];

// tags.js
export const TAGS = {
  ia: TAGS_IA,
  parecer: TAGS_PARECER,
  programa: TAGS_PROGRAMA,
  universais: TAGS_UNIVERSAIS,
  todasTags: [
    ...TAGS_IA,
    ...TAGS_PARECER,
    ...TAGS_PROGRAMA,
    ...TAGS_UNIVERSAIS,
  ],
};

export const ETAPAS = [
  { id: 1, text: "Editar tags" },
  { id: 2, text: "Editar parâmetros de saída" },
  { id: 3, text: "Análise dos dados" },
];
