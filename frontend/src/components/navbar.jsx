import Logo from "../assets/pen.svg";
import Tags from "./tabs";

function Navbar({ userReferences, onSelecionarCaminho, onVoltar, tags }) {
  return (
    <div className="navbar">
      <Empresa userReferences={userReferences} />
      <hr />
      {tags.map((tag) => (
        <Tags
          key={tag.id}
          tag={tag}
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
