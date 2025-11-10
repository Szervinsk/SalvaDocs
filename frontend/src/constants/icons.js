// ==========================================================================
// IMPORTAÇÕES DOS ÍCONES
// ==========================================================================

// Ant Design Icons (ai)
import { AiOutlineHome, AiOutlineReload, AiOutlineCloseCircle } from "react-icons/ai"; // Adicionado AiOutlineCloseCircle

// BoxIcons (bi)
import { BiSolidBusiness } from "react-icons/bi";

import { IoMdKey, IoMdLink} from "react-icons/io";

// Phosphor Icons (pi)
import { PiSpinnerGapBold } from "react-icons/pi";

// Grommet-Icons (gr)
import { GrScorecard } from "react-icons/gr";

// Font Awesome (fa)
import { FaCheck, FaClockRotateLeft, FaPenNib, FaQuestion, FaRegFolder, FaRegLightbulb, FaTags, FaTrash, FaRegStar } from "react-icons/fa6";

// Feather (fi)
import { FiFileText, FiSend, FiSun, FiMoon, FiCheckCircle, FiAlertTriangle, FiInfo, FiUploadCloud, FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiCode, FiDownload } from "react-icons/fi"; // Adicionados CheckCircle, AlertTriangle, Info

// Heroicons (hi)
import { HiOutlineAdjustmentsHorizontal, HiOutlineClipboardDocument, HiOutlineClipboardDocumentCheck, HiOutlineClipboardDocumentList, HiOutlineDocumentText, HiOutlineUserCircle } from "react-icons/hi2";

// IcoMoon Free (im)
import { ImFontSize, ImHammer2 } from "react-icons/im";

// Ionicons (io)
import { IoIosArrowDown, IoIosArrowForward, IoIosArrowUp } from "react-icons/io";
import { IoAdd, IoClose, IoRocketOutline } from "react-icons/io5";

// Lucide (lu)
import { LuCalendarDays, LuCircleDashed, LuDoorOpen, LuFileSearch, LuLayoutDashboard, LuTextSearch , LuClipboard} from "react-icons/lu";

// Material Design (md)
import { MdFileUpload, MdOutlineDocumentScanner, MdOutlineEditNote, MdOutlineMoreHoriz, MdOutlineSearch, MdOutlineSettings, MdOutlineSubtitles, MdPeopleAlt , MdAlternateEmail, MdFilterAlt ,MdOutlineDataUsage} from "react-icons/md";

// Phosphor Icons (pi)
import { PiArchive, PiChartPie, PiFilePdf, PiListChecks } from "react-icons/pi";

import { RiRobot2Line } from "react-icons/ri";

// Tabler Icons (tb)
import { TbLayoutSidebarRight, TbNumber123, TbPigMoney } from "react-icons/tb";

// VS Code Icons (vsc)
import { VscLaw } from "react-icons/vsc";

import { FaTools } from "react-icons/fa";

// ==========================================================================
// OBJETO DE ÍCONES CENTRALIZADO
// ==========================================================================
export const Icons = {
  // ============================
  // Navegação Principal e Layout
  // ============================
  Home: AiOutlineHome,
  Dashboard: LuLayoutDashboard,
  Bot: RiRobot2Line,
  BackIn: TbLayoutSidebarRight,
  DoorOpen: LuDoorOpen,
  ArrowDown: IoIosArrowDown,
  ArrowUp: IoIosArrowUp,
  ArrowRight: FiArrowRight,
  ArrowLeft: FiArrowLeft,
  Tools: FaTools,
  Key: IoMdKey,
  Email: MdAlternateEmail,

  // ============================
  // Ações Comuns
  // ============================
  Add: IoAdd,
  EditNote: MdOutlineEditNote,
  Delete: FaTrash,
  Send: FiSend,
  Upload: MdFileUpload,
  UploadCloud: FiUploadCloud,
  Download: FiDownload,
  Search: MdOutlineSearch,
  Close: IoClose,
  MoreHorizontal: MdOutlineMoreHoriz,
  Eye: FiEye,
  EyeOff: FiEyeOff,
  Star: FaRegStar,
  Link: IoMdLink,


  // ============================
  // Feedback e Status
  // ============================
  Check: FaCheck,
  CheckCircle: FiCheckCircle,
  CloseCircle: AiOutlineCloseCircle,
  AlertTriangle: FiAlertTriangle,
  Info: FiInfo,
  Retry: AiOutlineReload,
  Selected: LuCircleDashed,
  Clock: FaClockRotateLeft,
  Question: FaQuestion,
  Lamp: FaRegLightbulb,

  // ============================
  // Configurações e UI
  // ============================
  Settings: MdOutlineSettings,
  Adjustments: HiOutlineAdjustmentsHorizontal,
  Sun: FiSun,
  Moon: FiMoon,
  FontSize: ImFontSize,

  // ============================
  // Documentos, Pastas e Modelos
  // ============================
  FileText: FiFileText,
  DocumentText: HiOutlineDocumentText,
  FileList: PiListChecks,
  ScannerDocument: MdOutlineDocumentScanner,
  Pdf_file: PiFilePdf,
  Folder: FaRegFolder,
  Archive: PiArchive,
  Model: LuLayoutDashboard,
  Code: FiCode,
  Clipboard: LuClipboard,
  Filter: MdFilterAlt,
  
  // Modelos Específicos (Pranchetas)
  Despacho: HiOutlineClipboardDocument,
  Parecer: HiOutlineClipboardDocumentList,
  Programas: HiOutlineClipboardDocumentCheck,

  // ============================
  // Análise e Dados
  // ============================
  Tags: FaTags,
  TextSearch: LuTextSearch,
  FileSearch: LuFileSearch,
  ChartPie: PiChartPie,
  Graphics: MdOutlineDataUsage,
  Rocket: IoRocketOutline,
  Spinner: PiSpinnerGapBold,
  
  // Tags Específicas
  Summarize: FaPenNib,
  Title: MdOutlineSubtitles,
  Number: TbNumber123,
  Law: VscLaw,
  Hammer: ImHammer2,
  Score: GrScorecard,
  PigMoney: TbPigMoney,
  People: MdPeopleAlt,
  Business: BiSolidBusiness,
  
  // ============================
  // Diversos
  // ============================
  User: HiOutlineUserCircle,
  Calendar: LuCalendarDays,
};