import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOOLS, MORE_TOOLS } from "../../../constants/constants";
import { Icons } from "../../../constants/icons";
import Logo from "../../../assets/pen.svg";
import SearchBar from "../searchBar/searchbar";
import "./navbar.css";

function Navbar({ setTool, tool, user, onLogout, showAlternativeTools }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const navVariants = {
    expanded: { width: 280 },
    collapsed: { width: 100 },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
  };

  // filtro da barra de pesquisa
  const tools_filtradas = TOOLS.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const other_tools_filtradas = MORE_TOOLS.filter(tool => tool.name.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
    <motion.nav
      className={`navbar ${isCollapsed ? "collapsed" : ""}`}
      variants={navVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="navbar-top">
        <div className="navbar-header">
          <div className="logo-wrapper">
            <img src={Logo} alt="SalvaDocs Logo" className="logo-icon" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h2 variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="app-title">
                  <h2 className="app-title">SalvaDocs</h2>
                </motion.h2>
              )}


            </AnimatePresence>
          </div>
          <button className="toggle-btn" onClick={toggleSidebar} title={isCollapsed ? "Expandir" : "Recolher"}>
            <Icons.BackIn size={20} />
          </button>
        </div>

        <div className="navbar-search">
          <AnimatePresence>
            {!isCollapsed ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder={"Buscar ferramentas..."}
                />
              </motion.div>
            ) : (
              <div className="search-icon-wrapper">
                <Icons.Search size={20} onClick={()=> setIsCollapsed(!isCollapsed)}/>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="navbar__tools">
          <>
            <hr />
            <div className="tools-Header">
              <Icons.Tools size={15} className="icons-r" />
              {!isCollapsed && <h5>Ferramentas</h5>}
            </div>

            {tools_filtradas.length > 0 ? (
              tools_filtradas.map((item) => (
                <button
                  key={item.id}
                  className={`tool-item ${tool === item.id ? "active" : ""}`}
                  onClick={() => setTool(item.id)}
                  title={`${item.name}${item.shortcut ? ` (Shift + ${item.shortcut})` : ""}`}
                >
                  <div className="flex-row" style={{ gap: "10px" }}>
                    <div className="tool-item__icon">{item.icon}</div>
                    {!isCollapsed && (
                      <span className="tool-item__label">{item.name}</span>
                    )}
                  </div>

                  {item.shortcut && !isCollapsed && (
                    <kbd className="tool-item__shortcut">
                      shift + {item.shortcut}
                    </kbd>
                  )}
                </button>
              ))
            ) : (
              <h5 className="thin" style={{ marginBottom: "10px" }}>Não foram encontradas ferramentas</h5>
            )}
          </>

          {showAlternativeTools && (
            <>
              {other_tools_filtradas.length > 0 ? (
                other_tools_filtradas.map((item) => (
                  <button
                    key={item.id}
                    className={`tool-item ${tool === item.id ? "active" : ""}`}
                    onClick={() => setTool(item.id)}
                    title={`${item.name}${item.shortcut ? ` (Shift + ${item.shortcut})` : ""}`}
                  >
                    <div className="flex-row" style={{ gap: "10px" }}>
                      <div className="tool-item__icon">{item.icon}</div>
                      {!isCollapsed && (
                        <span className="tool-item__label">{item.name}</span>
                      )}
                    </div>

                    {item.shortcut && !isCollapsed && (
                      <kbd className="tool-item__shortcut">
                        shift + {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              ) : (
                <h5 className="thin">Não foram encontradas ferramentas</h5>
              )}
            </>
          )}
        </div>
      </div>
      {/* --- SEÇÃO INFERIOR (CONTA) --- */}
      <div className="navbar-footer">
        <div className="account-info">
          <div className="account-img"></div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="user-details">
                {user?.username ? (
                  <span className="user-name">{user.username}</span>
                ) : (
                  <span className="user-name-placeholder">Recarregue</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button className="logout-btn" onClick={onLogout} title="Sair">
          {user?.username ? <Icons.DoorOpen size={20} /> : <Icons.Retry size={20} />}
        </button>
      </div>
    </motion.nav>
  );
}

export default Navbar;