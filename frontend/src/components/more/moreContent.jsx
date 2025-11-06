
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
        dasdasd
      </div>
    </div>
  );
}

export default MoreContent;