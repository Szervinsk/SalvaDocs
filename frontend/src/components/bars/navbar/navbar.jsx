import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOOLS, TOOLS_ACCOUNT } from "../../../constants/constants";
import { Icons } from "../../../constants/icons";
import Logo from "../../../assets/pen.svg";
import SearchBar from "../searchBar/searchbar";
import "./navbar.css";

// ==========================================================================
// COMPONENTE DO MODAL FLUTUANTE (Sem alterações)
// ==========================================================================
const AccountModal = ({ user, onLogout, darkMode, setDarkMode, setTool, setOpenModalAccount }) => {
  const handleToolClick = (id) => {
    setTool(id);
    setOpenModalAccount(false);
  };
  return (
    <motion.div
      className="account-modal-popup"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="account-modal-popup__section">
        {TOOLS_ACCOUNT.map((tool) => (
          <button
            key={tool.id}
            className="account-modal-item"
            onClick={() => handleToolClick(tool.id)}
          >
            {tool.icon} {tool.name}
          </button>
        ))}
      </div>
      <div className="account-modal-popup__section">
        <div className="theme-toggle-control">
          <button className={`theme-btn ${!darkMode ? "active" : ""}`} onClick={() => setDarkMode(false)}>
            <Icons.Sun size={16} /> Claro
          </button>
          <button className={`theme-btn ${darkMode ? "active" : ""}`} onClick={() => setDarkMode(true)}>
            <Icons.Moon size={16} /> Escuro
          </button>
        </div>
      </div>
      <div className="account-modal-popup__section">
        <button className="account-modal-item logout" onClick={onLogout}>
          <Icons.DoorOpen size={18} /> Sign out
        </button>
      </div>
    </motion.div>
  );
};


// ==========================================================================
// SUB-COMPONENTE PARA CADA ITEM DA NAVEGAÇÃO (COM LÓGICA DE SUBMENU)
// ==========================================================================
const ToolItem = ({ item, tool, setTool, isCollapsed, openSubmenu, setOpenSubmenu, setDataView, dataView, handleScrollTo }) => {
  const hasSubtools = item.subtools && item.subtools.length > 0;
  const isActive = tool === item.id || (item.subtools && item.subtools.map(s => s.id).includes(tool));
  const isSubmenuOpen = openSubmenu === item.id;

  const handleClick = () => {
    if (hasSubtools) {
      setOpenSubmenu(isSubmenuOpen ? null : item.id);
    } else {
      setTool(item.id);
    }
  };

  const handleSubtoolClick = (e, subItem) => {
    e.stopPropagation();

    // 1. Define a ferramenta PAI (ex: tool 2 para "Relatório")
    setTool(item.id); // Usa o 'item.id' que é o ID pai

    // 2. Define a visão específica (ex: 1 para "Documentos", 2 para "Dashboard")
    if (item.id === 2) {
      setDataView(subItem.attribute); // Usa o 'attribute' do sub-item
    }
    if (item.id === 3) {
      handleScrollTo(subItem.attribute);
    }
  };

  return (
    // algumas tools ainda estão em fase de desenvolvimento, depois deve-se retirar a tag de develop
    <div className="tool-item-container" >
      <div>
        <button
          className={`tool-item ${isActive ? "active" : ""}`}
          onClick={handleClick}
          title={item.name}
        >
          <div className="flex-row" style={{ gap: "10px" }}>
            <div className="tool-item__icon">{item.icon}</div>
            {!isCollapsed && (
              <span className="tool-item__label">{item.name}</span>
            )}
          </div>
          {hasSubtools && !isCollapsed && (
            <Icons.ArrowDown size={16} className={`tool-item__chevron ${isSubmenuOpen ? 'open' : ''}`} />
          )}
        </button>

        <AnimatePresence>
          {hasSubtools && isSubmenuOpen && !isCollapsed && (
            <motion.div
              className="submenu-list"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {item.subtools.map(subItem => (
                <button
                  key={subItem.id}
                  // ATIVADO: O item fica ativo se o PAI estiver ativo E a visão for a correta
                  className={`submenu-item ${tool === item.id && dataView === subItem.haveData ? "active" : ""}`}
                  onClick={(e) => handleSubtoolClick(e, subItem)}
                >
                  {subItem.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================================================
// COMPONENTE PRINCIPAL DA NAVBAR
// ==========================================================================
function Navbar({ setTool, tool, user, onLogout, setDarkMode, darkMode, setDataView, dataView, handleScrollTo }) {
  // 1. Inicia como TRUE (fechado/pequeno)
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openModalAccount, setOpenModalAccount] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Variantes de animação
  const navVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10, display: "none" },
    visible: { 
      opacity: 1, 
      x: 0, 
      display: "block",
      transition: { duration: 0.2, delay: 0.1 } 
    },
  };

  // Funções de Mouse
  const handleMouseEnter = () => {
    setIsCollapsed(false);
  };

  const handleMouseLeave = () => {
    setIsCollapsed(true);
    setOpenSubmenu(null); // Fecha submenus ao sair
    setOpenModalAccount(false); // Opcional: fecha modal de conta ao sair
  };

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    setOpenSubmenu(null);
  };

  const getInitials = (name = "") => {
    if (!name) return "";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  };

  const tools_filtradas = TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!openModalAccount) return;
    const handleClickOutside = () => setOpenModalAccount(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [openModalAccount]);

  return (
    <motion.nav
      // Adiciona classe collapsed se for true
      className={`navbar ${isCollapsed ? "collapsed" : ""}`} 
      variants={navVariants}
      initial="collapsed" // Estado inicial da animação
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // Eventos de Mouse
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="navbar-top">
        <div className="navbar-header">
          <div className="logo-wrapper">
            <img src={Logo} alt="SalvaDocs Logo" className="logo-icon" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h2 variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="app-title">
                  SalvaDocs
                </motion.h2>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="navbar-search">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div 
                key="search-bar"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder={"Buscar..."} />
              </motion.div>
            ) : (
              <motion.div 
                key="search-icon"
                className="search-icon-wrapper"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                {/* Ao clicar na lupa, expande a barra */}
                <Icons.Search size={20} onClick={() => setIsCollapsed(false)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="navbar__tools">
          {tools_filtradas.map((item) => (
            (item.id !== 6 && item.id !== 8) && (
              <ToolItem
                key={item.id}
                item={item}
                tool={tool}
                setTool={setTool}
                isCollapsed={isCollapsed}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
                setDataView={setDataView}
                handleScrollTo={handleScrollTo}
              />
            )
          ))}
        </div>
      </div>

      <div className="navbar-footer">
        <AnimatePresence>
          {openModalAccount && !isCollapsed && (
            <AccountModal
              user={user}
              onLogout={onLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              setTool={setTool}
              setOpenModalAccount={setOpenModalAccount}
            />
          )}
        </AnimatePresence>

        <div
          className="account-info-trigger"
          onClick={(e) => {
            // Se estiver fechado, expande primeiro antes de abrir o modal
            if (isCollapsed) {
                setIsCollapsed(false);
                return;
            }
            e.stopPropagation();
            setOpenModalAccount(prev => !prev);
          }}
        >
          <div className="account-info">
            <div className="account-img">{getInitials(user?.username)}</div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="user-details">
                  <span className="user-name">{user?.username || "Usuário"}</span>
                  <span className="user-email">{user?.email || "email@app.com"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Opcional: Esconder botão de toggle já que o hover faz o trabalho */}
          {!isCollapsed && (
             <button className="toggle-btn" onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}>
               <Icons.BackIn size={20} />
             </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;