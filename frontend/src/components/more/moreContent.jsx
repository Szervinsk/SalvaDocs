import { Icons } from "../../constants/icons";
function MoreContent({ setTool, setMore }) {

  const MORE_TOOLS = [
    { 
      id: 6, 
      name: "Monitoramento de API", 
      icon: <Icons.Model size={20} />, // Usando o componente de ícone diretamente
      description: "Visualize as requisições do sistema."
    },
    { 
      id: 7, 
      name: "Sobre o Projeto", 
      icon: <Icons.Question size={20} />,
      description: "Conheça mais sobre a aplicação."
    },
  ];

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
        {MORE_TOOLS.map((item) => (
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

export default MoreContent;