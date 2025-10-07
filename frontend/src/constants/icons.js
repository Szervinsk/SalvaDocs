// ==========================================================================
// IMPORTAÇÕES DOS ÍCONES (CORRIGIDO)
// Ícones importados diretamente de seus pacotes específicos.
// ==========================================================================

// Ant Design Icons (ai)
import { AiOutlineHome, AiOutlineReload } from "react-icons/ai";

// BoxIcons (bi)
import { BiArchive, BiSolidBusiness } from "react-icons/bi";

// Bootstrap Icons (bs) - Nenhum ícone BsTrash existe, usei FaTrash de Font Awesome
// import { BsTrash } from "react-icons/bs"; 

// Font Awesome (fa)
import { FaArrowLeftLong, FaCheck, FaClockRotateLeft, FaPenNib, FaQuestion, FaRegFolder, FaRegLightbulb, FaTags, FaTrash } from "react-icons/fa6"; // BsTrash não existe, usei FaTrash

// Feather (fi)
import { FiFileText, FiSend, FiSun, FiMoon } from "react-icons/fi";

// Grit Icons (gr)
import { GrScorecard } from "react-icons/gr";

// Heroicons (hi)
import {HiOutlineAdjustmentsHorizontal, HiOutlineClipboardDocument, HiOutlineClipboardDocumentCheck, HiOutlineClipboardDocumentList, HiOutlineDocumentText, HiOutlineUserCircle } from "react-icons/hi2";

// IcoMoon Free (im)
import { ImFontSize, ImHammer2 } from "react-icons/im";

// Ionicons (io)
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward, IoIosArrowUp, IoMdAdd, IoMdClose } from "react-icons/io";

// Lucide (lu)
import { LuCalendarDays, LuCircleDashed, LuDoorOpen, LuFileSearch, LuLayoutPanelLeft, LuTextSearch } from "react-icons/lu";

// Material Design (md)
import { MdFileUpload, MdOutlineDocumentScanner, MdOutlineEditNote, MdOutlineMoreHoriz, MdOutlineSearch, MdOutlineSubtitles, MdPeopleAlt } from "react-icons/md";

// Phosphor Icons (pi)
import { PiFilePdf } from "react-icons/pi";

// Remix Icon (ri)
import { RiArchiveLine, RiExpandDiagonalLine } from "react-icons/ri";

// Simple Line Icons (sl)
import { SlGraph } from "react-icons/sl";

// Tabler Icons (tb)
import { TbDeviceDesktopAnalytics, TbLayoutSidebarRight, TbNumber123, TbPigMoney } from "react-icons/tb";

// VS Code Icons (vsc)
import { VscLaw } from "react-icons/vsc";


// ==========================================================================
// OBJETO DE ÍCONES CENTRALIZADO
// ==========================================================================
export const Icons = {
  // ============================
  // Ações Gerais
  // ============================
  Add: IoMdAdd,                      // Sinal de mais (+) para adicionar ou criar.
  EditNote: MdOutlineEditNote,       // Lápis para editar.
  Delete: FaTrash,                   // Lixeira para excluir (BsTrash não encontrado, substituído).
  Check: FaCheck,                    // Visto para confirmar ou sucesso.
  Upload: MdFileUpload,              // Seta para cima para upload de arquivo.
  Send: FiSend,                      // Avião de papel para enviar.
  Retry: AiOutlineReload,            // Seta circular para tentar novamente.

  // ============================
  // Navegação e Layout
  // ============================
  Home: AiOutlineHome,               // Casa para a página inicial.
  Close: IoMdClose,                  // 'X' para fechar modais ou alertas.
  BackIn: TbLayoutSidebarRight,      // Seta entrando em um container, para retornar.
  BackInSeta: FaArrowLeftLong,       // Seta longa para a esquerda, para voltar.
  DoorOpen: LuDoorOpen,              // Porta aberta, geralmente para logout ou sair.
  Expandir: RiExpandDiagonalLine,    // Setas diagonais para expandir para tela cheia.
  Layout: LuLayoutPanelLeft,         // Painel para representar layout ou sidebar.
  ArrowDown: IoIosArrowDown,        // Seta para baixo.
  ArrowUp: IoIosArrowUp,            // Seta para cima.
  ArrowRight: IoIosArrowForward,     // Seta para a direita.
  ArrowLeft: IoIosArrowBack,         // Seta para a esquerda.

  // ============================
  // UI e Controles de Interface
  // ============================
  Search: MdOutlineSearch,           // Lupa para pesquisa geral.
  SearchFile: LuFileSearch,          // Lupa sobre um arquivo para pesquisa de documentos.
  TextSearch: LuTextSearch,          // Lupa sobre linhas de texto.
  MdOutlineMoreHoriz: MdOutlineMoreHoriz, // Três pontos para menu de "mais opções".
  Adjustments: HiOutlineAdjustmentsHorizontal, // Controles deslizantes para configurações ou filtros.
  Selected: LuCircleDashed,          // Círculo tracejado para indicar seleção.
  Sun: FiSun,                        // Sol, para tema claro.
  Moon: FiMoon,                      // Lua, para tema escuro.
  FontSize: ImFontSize,              // Ícone 'A' para ajuste de fonte.
  Interface: HiOutlineAdjustmentsHorizontal, // Ícone para seções de Interface. (Reutilizado)

  // ============================
  // Documentos e Arquivos
  // ============================
  FileText: FiFileText,              // Documento genérico com texto.
  DocumentText: HiOutlineDocumentText, // Outra variação de documento de texto.
  ScannerDocument: MdOutlineDocumentScanner, // Documento sendo escaneado.
  Pdf_file: PiFilePdf,               // Ícone específico para arquivos PDF.
  Folder: FaRegFolder,               // Pasta de arquivos.
  Archive: RiArchiveLine,            // Caixa de arquivo.
  Process: BiArchive,                // Variação de caixa de arquivo.
  Despacho: HiOutlineClipboardDocument, // Prancheta para modelo "Despacho".
  Parecer: HiOutlineClipboardDocumentList, // Prancheta com lista para "Parecer".
  Programas: HiOutlineClipboardDocumentCheck, // Prancheta com visto para "Programas".
  
  // ============================
  // Ícones Temáticos e de Dados
  // ============================
  Model: TbDeviceDesktopAnalytics,   // Monitor com gráfico, para "Modelos".
  Graphics: SlGraph,                 // Gráfico de linha.
  Tags: FaTags,                      // Etiqueta para tags.
  Lamp: FaRegLightbulb,              // Lâmpada para dicas ou modelos.
  User: HiOutlineUserCircle,         // Círculo com usuário para perfil ou conta.
  Calendar: LuCalendarDays,          // Calendário para datas.
  Clock: FaClockRotateLeft,          // Relógio com seta, para histórico ou recentes.
  Question: FaQuestion,              // Ponto de interrogação para ajuda.
  
  // ============================
  // Tags Específicas
  // ============================
  Summarize: FaPenNib,               // Pena para resumir texto.
  Title: MdOutlineSubtitles,         // Ícone de título ou cabeçalho.
  Number: TbNumber123,               // Números para extração de dados numéricos.
  Law: VscLaw,                       // Balança da justiça para temas legais.
  Hammer: ImHammer2,                 // Martelo do juiz.
  Score: GrScorecard,                // Cartão de pontuação.
  PigMoney: TbPigMoney,              // Porco-cofrinho para finanças.
  People: MdPeopleAlt,               // Múltiplos usuários para partes envolvidas.
  Business: BiSolidBusiness,         // Prédio para empresas ou negócios.
};