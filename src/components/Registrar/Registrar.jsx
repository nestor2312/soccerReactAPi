import { useState } from "react";
import "./index.css"
import FORM_Teams from "../Formularios/Formu_equipos";
import FORM_Groups from "../Formularios/Formu_grupos";
import FORM_Matches from "../Formularios/Formu_partidos";
import FORM_Players from "../Formularios/Formu_jugadores";
import LogoutButton from "../Login/CerrarSesion";


const Registrar = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const togglePanel = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <>
      <div className="panel-group margen" id="accordion">
    <LogoutButton></LogoutButton>
      <h1>Ingresar información</h1>
      <div className="panel panel-default">
          <div className="panel-heading box-info">
            <h4 className="panel-title">
              <button
                onClick={() => togglePanel(1)}
                className={`btn btn-link ${activeIndex === 1 ? '' : 'collapsed'}`}
                aria-expanded={activeIndex === 1 ? 'true' : 'false'}
              >
               Grupo
              </button>
            </h4>
          </div>
          <div className={`panel-collapse collapse ${activeIndex === 1 ? 'show' : ''}`}>
            <div className="panel-body cardd">
             <FORM_Groups/>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading box-info">
            <h4 className="panel-title">
              <button
                onClick={() => togglePanel(2)}
                className={`btn btn-link ${activeIndex === 2 ? '' : 'collapsed'}`}
                aria-expanded={activeIndex === 2 ? 'true' : 'false'}
              >
               Equipo
              </button>
            </h4>
          </div>
          <div className={`panel-collapse collapse ${activeIndex === 2 ? 'show' : ''}`}>
            <div className="panel-body cardd">
             <FORM_Teams/>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading box-info">
            <h4 className="panel-title">
              <button
                onClick={() => togglePanel(3)}
                className={`btn btn-link ${activeIndex === 3 ? '' : 'collapsed'}`}
                aria-expanded={activeIndex === 3 ? 'true' : 'false'}
              >
               Partidos
              </button>
            </h4>
          </div>
          <div className={`panel-collapse collapse ${activeIndex === 3 ? 'show' : ''}`}>
            <div className="panel-body cardd">
            <FORM_Matches/>
            </div>
          </div>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading box-info">
            <h4 className="panel-title">
              <button
                onClick={() => togglePanel(4)}
                className={`btn btn-link ${activeIndex === 4 ? '' : 'collapsed'}`}
                aria-expanded={activeIndex === 4 ? 'true' : 'false'}
              >
                Jugadores
              </button>
            </h4>
          </div>
          <div className={`panel-collapse collapse ${activeIndex === 4 ? 'show' : ''}`}>
            <div className="panel-body cardd">
             <FORM_Players/>
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};

export default Registrar;
