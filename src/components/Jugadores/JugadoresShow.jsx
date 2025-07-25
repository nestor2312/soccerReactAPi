// JugadorShow.jsx
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import { useParams, Link } from "react-router-dom";
import "./index.css";
import ErrorLogo from "../../assets/Vector.svg";
const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const JugadorShow = () => {
   const { categoriaId, subcategoriaId , jugadorId} = useParams();

  const [jugador, setJugador] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((f) => !f);

  useEffect(() => {
    const getJugador = async () => {
      try {
        const { data } = await axios.get(`${endpoint}jugadores/${jugadorId}`);
        setJugador(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el jugador.");
      } finally {
        setIsLoading(false);
      }
    };
    if (jugadorId) getJugador();
  }, [jugadorId]);

  useEffect(() => {
    document.title = "Jugador detalles";
  }, []);

  return (
    <div className="layout" > 
      <Menu />

      <main className="main-content">
        {isLoading ? (
          <div className="loading-container" >
            <Cargando />
          </div>
        ) : error ? (
          <div className="loading-container">
            <ErrorCarga />
          </div>
        ) : jugador ? (
          <section className="margen Jugadores mt-4" >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5 mb-5">
                  <div className="flashcard d-flex align-items-center">
                    <div className={`card-body ${isFlipped ? "flipped" : ""}`}
                    
                    >
                      {/* Front */}
                      <div className="front">
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-8 text-center color-hover-animado" style={{
    background: `linear-gradient(180deg, #E0E0E0 0%, ${jugador.equipo?.color_hover} 100%)`,
    borderRadius: '0.375rem',
    padding: '0.1rem',
  
                           }} >
                            <img
                              src={`${Images}/${jugador.equipo?.archivo}`}
                              className="logo w-25"
                              alt={jugador.equipo?.nombre}
                               onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = ErrorLogo; 
                              }}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="text-center w-75">
                            <table className="table table-borderless w-100">
                              <tbody>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Nombre:ss
                                  </th>
                                  <td className="text-right text-flip-card text-capitalize">
                                    {jugador.nombre} {jugador.apellido}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Equipo:
                                  </th>
                                  <td className="text-right text-flip-card text-capitalize">
                                    {jugador.equipo.nombre}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Edad:
                                  </th>
                                  <td className="text-right text-flip-card">
                                    {jugador.edad}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Número:
                                  </th>
                                  <td className="text-right text-flip-card">
                                    {jugador.numero}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-8 text-center">
                            <button
                              className="btn-flip flip"
                              onClick={handleFlip}
                            >
                              <span>Estadísticas</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Back */}
                      <div className="back">
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-8 text-center" style={{
    background: `linear-gradient(180deg, #E0E0E0 0%, ${jugador.equipo?.color_hover} 100%)`,
    borderRadius: '0.375rem',
    padding: '0.1rem',
   
                           }} >
                            <img
                              src={`${Images}/${jugador.equipo?.archivo}`}
                              className="logo w-25"
                              alt={jugador.equipo?.nombre}
                               onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = ErrorLogo; 
                              }}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="text-center w-75">
                            <table className="table table-borderless w-100">
                              <tbody>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Goles:
                                  </th>
                                  <td className="text-right text-flip-card text-capitalize">
                                    {jugador.goles}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Asistencias:
                                  </th>
                                  <td className="text-right text-flip-card text-capitalize">
                                    {jugador.asistencias}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    T. Amarillas:
                                  </th>
                                  <td className="text-right text-flip-card">
                                    {jugador.card_amarilla}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    T. Rojas:
                                  </th>
                                  <td className="text-right text-flip-card">
                                    {jugador.card_roja}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-12 text-center">
                            <button
                              className="btn-flip flip"
                              onClick={handleFlip}
                            >
                              <span>Informacion</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center">
                          <Link 
                                  to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores`}
                                 className={` ${location.pathname.includes('estadisticas') ? 'active' : ''}`}
                               >
                            <button className="btn-flip flip">
                              <span>Volver a jugadores</span>
                            </button>
                          </Link>
                        </div>
          </section>
        ) : (
          <p className="no-datos">
            No hay Jugadores disponibles en este momento.
          </p>
        )}
      </main>

      {!isLoading && !error && <Footer />}
    </div>
  );
};

export default JugadorShow;
