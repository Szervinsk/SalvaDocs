import React from "react";
import Logo from "../assets/pen.svg";

function Navbar({ userReferences }) {
  function searchIt() {
    alert("searching");
  }

  return (
    <div className="navbar">
      <Empresa userReferences={userReferences} />
      <Searchbar onSearch={searchIt} />
    </div>
  );
}

function Empresa({ userReferences }) {
  return (
    <div className="flex-left-right , businessCard">
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

function Searchbar({ onSearch }) {
  return (
    <div className="search-container">
      <input type="text" />
      <div className="icon-search" onClick={onSearch}>
        🔍
      </div>
    </div>
  );
}

export default Navbar;
