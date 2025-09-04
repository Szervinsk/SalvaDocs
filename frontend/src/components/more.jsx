import { Icons } from "../constants/icons";
import "../styles/global.css"

function More({ more, docSelecionado, setMore }) {
  {
    more && (
      <div className="moreOptions">
        <div className="moreOptions-bar">
          <h3>Mais opções</h3>
          <Icons.Close
            size={20}
            className="icons"
            onClick={() => setMore(!more)}
          />
        </div>

        {!docSelecionado ? (
          <ul style={{ padding: 0 }}>
            <li className="flex-left-right" style={{ marginBottom: "10px" }}>
              <button className="action-big-btns">
                <Icons.Question size={20} className="icons" />
                <h3>Dúvidas sobre</h3>
              </button>
            </li>

            <li className="flex-left-right">
              <button className="action-big-btns">
                <Icons.Search size={20} className="delete" />
                <h3>Ajuda eu</h3>
              </button>
            </li>
          </ul>
        ) : (
            <ul style={{ padding: 0 }}>
            <li className="flex-left-right" style={{ marginBottom: "10px" }}>
              <button className="action-big-btns">
                <Icons.Question size={20} className="icons" />
                <h3>Ajuda</h3>
              </button>
            </li>

            <li className="flex-left-right">
              <button className="action-big-btns">
                <Icons.Graphics size={20} className="delete" />
                <h3>Ver relatório do dados</h3>
              </button>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default More;
