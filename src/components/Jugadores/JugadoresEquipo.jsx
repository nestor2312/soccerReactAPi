import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import "./index.css";
import ErrorLogo from "../../assets/Vector.svg";

function getTextColor(bgColor) {
  if (!bgColor) return '#000000';
  const color = bgColor.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? '#ffffff' : '#000000';
}

const JugadoresEquipo = () => {
  const { equipoId, categoriaId, subcategoriaId } = useParams();
  const [equipo, setEquipo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEquipoYJugadores = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}equipos/${equipoId}/jugadores`);
        setEquipo(response.data);
      } catch (err) {
        setError("Error al cargar los datos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipoYJugadores();
  }, [equipoId]);

  useEffect(() => {
    document.title = "Jugadores del Equipo";
  }, []);

  return (
    <div className="layout">
      <Menu />

      <main className="main-content">
        {isLoading ? (
          <div className="loading-container">
            <Cargando />
          </div>
        ) : error ? (
          <div className="loading-container">
            <ErrorCarga />
          </div>
        ) : equipo ? (
          (() => {
            const textColor = getTextColor(equipo.color_hover);
            return (
              <div
                className="container mt-2"
               
              >
               <div
  className="text-center color-hover-animado"
  style={{
    background: `linear-gradient(180deg, #E0E0E0 0%, ${equipo.color_hover} 100%)`,
    borderRadius: '0.375rem',
    padding: '0.5rem',
    width: '100%',
    color: textColor,
  }}
>
<div className="my-4">
  
                  <img
                    src={`${IMAGES_URL}/${equipo.archivo}`}
                    alt={equipo.nombre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = ErrorLogo;
                      e.target.classList.add("error-logo");
                    }}
                    width="100px"
                  
                  />
                  <h2 className="text-capitalize space">{equipo.nombre}</h2>
</div>
                </div>

                <h3 className="mt-3 mb-4 text-center">Jugadores</h3>

                <div className="row d-flex justify-content-around">
                  {equipo.jugadores.map((Player) => (
                    <div
                      key={Player.id}
                      className="col-md-2 col-sm-4 col-6 mb-4 d-flex justify-content-around"
                    >
                      <Link
                        className="not-margin"
                        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadoresteam/${Player.id}`}
                      >
                        <div className="team-item2">
                          <div className="card card-matches player-card" 
                           style={{
    '--hover-color': equipo.color_hover || '#00BF63',
  }}>
                            <div className="card-body">
                              <div className="row">
                                <div className="col-12 d-grid">
                                  <span className="team team-number text-center mb-3 mt-2" >
                                    <strong>{Player.numero}</strong>
                                  </span>
                                  <span className="team text-center">
                                    {Player.nombre} <strong>{Player.apellido}</strong>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center container">
                  <Link
                    to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/equipos`}
                    className={`${location.pathname.includes('jugadores') ? 'active' : ''}`}
                  >
                    <button className="btn-flip flip">
                      <span>Volver a equipos</span>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })()
        ) : (
          <p className="text-center">El equipo no tiene jugadores registrados.</p>
        )}
      </main>

      {!isLoading && !error && <Footer />}
    </div>
  );
};

export default JugadoresEquipo;
