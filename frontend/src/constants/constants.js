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


export const TOOLS = [
  {id: 1, name:"Pastas", icon:"Folder"},
  {id: 2, name:"Analisar Documentos", icon:"ScannerDocument"},
  {id: 3, name:"Sua Conta", icon:"Lamp"},
]
// Pastas iniciais
export const PASTAS = [
  { id: 1, name: "Despacho" },
  { id: 2, name: "Programas" },
  { id: 3, name: "Parecer" },
  { id: 4, name: "Outros" },
];

// Tags gerais (despacho)
export const TAGS_UNIVERSAIS = [
  {
    id: 1,
    content: "SEI",
    type: "regex",
    regex: "\\b(?:SEI|NUP)\\s*(\\d{5}-\\d{8}/\\d{4}-\\d{2})",
  },
  {
    id: 2,
    content: "Gdoc",
    type: "regex",
    regex:
      "\\b(?:GDOC|Doc\\. Id\\.|Doc\\. SEI(?:/GDF)?)\\s*(?:n[º°]?\\s*)?(\\d{6,}|\\d+/\\d{4})"
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
export const TAGS_IA = [
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
export const TAGS_PARECER = [
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
export const TAGS_PROGRAMA = [
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
