import { HiArrowNarrowLeft } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";

function Path({ path = [], onVoltar }) {
  return (
    <div className="div-path">
      {path.length > 0 && (
        <HiArrowNarrowLeft
          size={20}
          className="icons"
          onClick={onVoltar}
        />
      )}

      {path.map((item, index) => (
        <span
          key={index}
          className="path-item"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <h3 style={{ margin: 0 }}>{item}</h3>
          {index < path.length - 1 && (
            <IoIosArrowForward size={16} className="icons" />
          )}
        </span>
      ))}
    </div>
  );
}


export default Path;
