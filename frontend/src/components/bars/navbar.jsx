import { useState } from "react";
import { motion } from "framer-motion";
import { TOOLS } from "../../constants/constants";
import { Icons } from "../../constants/icons";
import Logo from "../../assets/pen.svg";
import SearchBar from "./searchbar";
import "../../styles/navbar.css";

function Navbar({ setTool, tool, setDocSelecionado }) {
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectedTool = tool;

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  return (
    <motion.div
      className={`sidebar-navbar ${collapsed ? "collapsed" : ""}`}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        {/* Topo da sidebar */}
        <div className="sidebar-navbar-header">
          <div className="logo-wrapper">
            <img src={Logo} alt="SalvaDocs Logo" className="logo icons" />
            {!collapsed && <h2 className="app-title">SalvaDocs</h2>}
          </div>
        </div>

        {/* Data */}
        {!collapsed ? (
          <div className="sidebar-navbar-date">
            <Icons.Calendar size={20} className="icons" />
            <h3>{new Date().toLocaleDateString("pt-BR")}</h3>
          </div>
        ) : (
          <div className="sidebar-navbar-date">
            <Icons.Calendar size={20} className="icons" />
          </div>
        )}

        {/* Busca */}
        {!collapsed ? (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder={"Buscar por ferramentas"}
          />
        ) : (
          <div className="search-collapsed">
            <Icons.Search size={20} className="icons" />
          </div>
        )}

        {/* Ferramentas */}
        <div className="sidebar-navbar-tools">
          {TOOLS.map((tool) => {
            const Icon = Icons[tool.icon];
            return (
              <div
                key={tool.id}
                className="tool-item"
                onClick={() => {
                  setTool(tool.id);
                }}
                style={
                  selectedTool === tool.id
                    ? { borderLeft: "7.5px solid var(--second-color-blue)" }
                    : {}
                }
              >
                <div className="tool-icon">
                  {Icon && <Icon size={20} className="icons" />}
                </div>
                {!collapsed && <span className="tool-label">{tool.name}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {!collapsed ? (
        <div className="sidebar-navbar-toggle-btn">
          <h3>Reduzir / Expandir menu</h3>
          <Icons.BackIn
            size={20}
            className={`toggle-btn ${collapsed ? "rotated" : ""}`}
            onClick={toggleSidebar}
            title={collapsed ? "Expandir" : "Recolher"}
          />
        </div>
      ) : (
        <Icons.BackIn
          size={20}
          className={`toggle-btn ${collapsed ? "rotated" : ""}`}
          onClick={toggleSidebar}
          title={collapsed ? "Expandir" : "Recolher"}
        />
      )}
    </motion.div>
  );
}

export default Navbar;
