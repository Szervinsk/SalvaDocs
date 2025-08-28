import { PASTAS } from "../constants/constants";

function DynamicsStaticts({ documentos }) {
  return (
    <main className="switch-area">
      <div className="dynamicsStatistics">
        <h2>Olá usuário,</h2>
        <h3>Estas são suas estatísticas</h3>
      </div>

      <div className="docs-container">
        <h4>Quantidade de documentos</h4>

        <ul className="div-qtd-docs">
          {PASTAS.map((pasta) => (
            <li className="pasta-dashboard">
              <h3>{pasta.name}</h3>
              <h2>
                {documentos.filter((doc) => pasta.name === doc.model).length}
              </h2>
            </li>
          ))}
        </ul>
        <h4>Quantidade total de documentos: {documentos.length}</h4>
      </div>
    </main>

    //aqui ficaram os atalhos para os modelos
    //o acesso as pastas, interface de criar modelos... e por aí vai...
  );
}

export default DynamicsStaticts;
