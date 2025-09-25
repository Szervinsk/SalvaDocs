import { Icons } from "../../../constants/icons";

function EditEtapas({
  etapas,
  etapaAtual,
  tremer,
  setCloseAlert,
  isEtapaDisabled,
  handleClick,
  file,
}) {
  const handleEtapaClick = (id) => {
    if (isEtapaDisabled(id)) {
      // se estiver bloqueado, dispara alerta
      if (id === 3 && !file) {
        setCloseAlert(false); // abre alerta
      }
      return;
    }
    handleClick(id); // chama goToEtapa do pai
  };

  return (
    <div className="flex-down-top edit-etapas-container">
      {(etapas || []).map((etapa, index) => {
        const disabled = isEtapaDisabled(etapa.id);
        return (
          <div
            key={etapa.id}
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div
              className={`edit-etapas 
                ${etapa.id === etapaAtual ? "etapa-ativa" : ""} 
                ${disabled ? "etapa-disabled" : ""} 
                ${tremer && etapa.id === etapaAtual ? "tremer" : ""}`}
              onClick={() => handleEtapaClick(etapa.id)}
            >
              {etapa.id === 1 && <Icons.Tags size={15} className="icons" />}
              {etapa.id === 2 && <Icons.DoorOpen size={15} className="icons" />}
              {etapa.id === 3 && (
                <Icons.TextSearch size={15} className="icons" />
              )}
              {etapa.text}
            </div>
            {index < etapas.length - 1 && <span> | </span>}
          </div>
        );
      })}
    </div>
  );
}

function BadAlert({ setCloseAlert }) {
  return (
    <div className="alert">
      <h3>Nenhum arquivo foi anexado</h3>
      <Icons.Close
        size={20}
        className="icons"
        onClick={() => setCloseAlert(true)}
      />
    </div>
  );
}

export default EditEtapas;
