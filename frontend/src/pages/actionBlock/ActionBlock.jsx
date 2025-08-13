import "../../styles/global.css";
import Path from "../../components/path";
import Block from "../../components/block";

function ActionBlock({ path, types, pastas, atualizarCaminho, voltarUmNivel }) {
  return (
    <div className="background-block">
      <Path path={path} onVoltar={voltarUmNivel} />
      <Block
        path={path}
        types={types}
        pastas={pastas}
        atualizarCaminho={atualizarCaminho}
      />
    </div>
  );
}

export default ActionBlock;
