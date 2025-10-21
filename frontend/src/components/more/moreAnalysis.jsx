import { UTILS } from "../../constants/constants";

function MoreAnalysis({ setTool, setMore }) {

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
        {UTILS.map((item) => (
          <button
            key={item.id}
            className="dropdown-item"
            onClick={() => handleItemClick(item.id)}
          >
            <div className="dropdown-item__icon">
              {item.icon}
            </div>
            <div className="dropdown-item__info">
              <span className="dropdown-item__name">{item.name}</span>
              <span className="dropdown-item__desc">{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoreAnalysis;