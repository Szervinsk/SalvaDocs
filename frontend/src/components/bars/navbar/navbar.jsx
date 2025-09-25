import { useState } from "react";
import { motion } from "framer-motion";
import { TOOLS } from "../../../constants/constants";
import { Icons } from "../../../constants/icons";
import Logo from "../../../assets/pen.svg";
import SearchBar from "../searchBar/searchbar";
import "./navbar.css";
import axios from "axios";

function Navbar({ setTool, tool, user, onLogout }) {
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
          <Icons.BackIn
            size={20}
            className={"btn-toggle"}
            onClick={toggleSidebar}
            title={collapsed ? "Expandir" : "Recolher"}
          />
        </div>

        {/* Data */}
        {!collapsed ? (
          <div className="sidebar-navbar-date">
            <Icons.Calendar size={20} className="icons" />
            <h4>{new Date().toLocaleDateString("pt-BR")}</h4>
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
                    ? { borderLeft: "7.5px solid var(--color-accent)" }
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

      <div className="navbar-account-div">
        <div className="flex-row" style={{ justifyItems: "center", gap: "10px" }}>
          <div className="account-img"></div>
          {user.username ?
            (
              <h3>{user.username}</h3>
            ) : (
              <h4 style={{fontSize: "var(--font-size-sm)"}}>Recarregue a página</h4>
            )}
        </div>
        {user.username ? (
          <Icons.DoorOpen size={20} className="icons-l , delete" onClick={() => onLogout()} />
          
        ): (
          
          <Icons.Retry size={20} className="icons-l , controle" onClick={() => onLogout()} />
        )}
      </div>
    </motion.div>
  );
}

export default Navbar;
