import { Icons } from "../../constants/icons";

function MoreContent({ setTool, setMore }) {

  const handleItemClick = (id) => {
    setTool(id);
    setMore(false);
  };

  return (
    <div className="more-dropdown">
      <div className="more-dropdown__header">
        <h4>Mais Opções</h4>
      </div>
      <div className="more-dropdown__list">
        <div className="dropdown-item" onClick={()=> (setTool(7))}>
          <Icons.Question size={20} className="dropdown-item__icon"/> <h4 className="dropdown-item__name">Sobre</h4>
        </div>
      </div>
    </div>
  );
}

export default MoreContent;