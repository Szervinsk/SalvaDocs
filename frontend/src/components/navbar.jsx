import { useState } from "react";
import Logo from "../assets/pen.svg";
import BigFolders from "./bigfolders";
import { MdOutlineSearch } from "react-icons/md";

function Navbar({ userReferences, onSelecionarCaminho, onVoltar, types }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // console.log("Types no navbar:", types);
  return (
    <div className="navbar">
      <Empresa userReferences={userReferences} />

      <form className="search-container" onSubmit={handleSearch}>
        <MdOutlineSearch size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Pesquise suas pastas"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="search-input"
        />
      </form>

      <hr />
      {types.map((type) => (
        <BigFolders
          key={type.id}
          type={type}
          searchQuery={searchQuery}
          forcarAbertura={searchQuery !== ""}
          onSelecionarCaminho={onSelecionarCaminho}
          onVoltar={onVoltar}
        />
      ))}
    </div>
  );
}

function Empresa({ userReferences }) {
  return (
    <div className="flex-left-right businessCard">
      <div className="icon-pen">
        <img src={Logo} alt="ícone" />
      </div>
      <div className="flex-top-down">
        <h1>{userReferences.empresa}</h1>
        {userReferences.funcao ? (
          <h2>{userReferences.funcao}</h2>
        ) : (
          <h2>Não informado</h2>
        )}
      </div>
    </div>
  );
}

export default Navbar;
