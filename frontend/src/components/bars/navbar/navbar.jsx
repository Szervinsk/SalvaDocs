import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TOOLS } from "../../../constants/constants";
import { Icons } from "../../../constants/icons";
import Logo from "../../../assets/pen.svg";
import SearchBar from "../searchBar/searchbar";
import "./navbar.css";

function Navbar({ setTool, tool, user, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const navVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2, delay: 0.1 } },
  };

  return (
    <motion.nav
      className={`navbar ${isCollapsed ? "collapsed" : ""}`}
      variants={navVariants}
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* --- SEÇÃO SUPERIOR --- */}
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
                <Icons.Search size={20} />
              </div>
            )}
          </AnimatePresence>
        </div>

        <ul className="navbar-tools">
          {TOOLS.map((toolItem) => {
            const Icon = Icons[toolItem.icon];
            const isSelected = tool === toolItem.id;
            return (
              <li
                key={toolItem.id}
                className={`tool-item ${isSelected ? "selected" : ""}`}
                onClick={() => setTool(toolItem.id)}
              >
                {Icon && <Icon size={20} className="tool-icon" />}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span variants={textVariants} initial="hidden" animate="visible" exit="hidden" className="tool-label">
                      {toolItem.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
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