import "../../styles/global.css";
import Path from "../../components/path";
import Block from "../../components/block";

function ActionBlock({ path, types,pastas }) {
  return (
    <div className="background-block">
      <Path path={path} />
      <Block path={path} types={types} pastas={pastas} />
    </div>
  );
}

export default ActionBlock;
