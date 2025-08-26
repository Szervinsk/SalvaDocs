import { Icons } from "../constants/icons";

function EditEtapas({
  etapas,
  etapaAtual,
  setEtapaAtual,
  anexou,
  alert,
  setAlert,
  tremer,
  setTremer,
  closeAlert,
  setCloseAlert
}) {
  const isEtapaDisabled = (id) => {
    if (id <= etapaAtual) return false; // voltar ou clicar na atual
    if (id === 2) return false;         // 1 → 2 sempre permitido
    if (id === 3) return !anexou;       // 1/2 → 3 só com anexo
    return false;
  };

  const handleClick = (id) => {
    if (isEtapaDisabled(id)) {
      setTremer(true);
      setAlert(true);
      setTimeout(() => setTremer(false), 500);
      setTimeout(() => setAlert(false), 2500);
      return;
    }
    setEtapaAtual(id);
  };

  return (
    <div className="flex-down-top edit-etapas-container">
      {alert && !closeAlert && <BadAlert setCloseAlert={setCloseAlert} />}
      {etapas.map((etapa, index) => {
        const disabled = isEtapaDisabled(etapa.id);
        return (
          <div key={etapa.id} style={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
            <div
              className={`edit-etapas 
                ${etapa.id === etapaAtual ? "etapa-ativa" : ""} 
                ${disabled ? "etapa-disabled" : ""} 
                ${tremer && etapa.id === etapaAtual ? "tremer" : ""}`}
              onClick={() => handleClick(etapa.id)}
            >
              {etapa.id === 1 && <Icons.Tags size={15} className="icons" />}
              {etapa.id === 2 && <Icons.DoorOpen size={15} className="icons" />}
              {etapa.id === 3 && <Icons.TextSearch size={15} className="icons" />}
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
      <Icons.Close size={20} className="icons" onClick={() => setCloseAlert(true)} />
    </div>
  );
}

export default EditEtapas;
