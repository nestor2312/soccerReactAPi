// JugadorShow.jsx
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import { useParams } from "react-router-dom";
import "./index.css"; // aquí están los estilos de .layout, .main-content, .loading-container, footer

const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const JugadorShow = () => {
  const { jugadorId } = useParams();
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
        ) : jugador ? (
          <section className="margen Jugadores mt-4">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-md-6 mt-5 mb-5">
                  <div className="card border-0 shadow flashcard d-flex align-items-center">
                    <div className={`card-body ${isFlipped ? "flipped" : ""}`}>
                      {/* Front */}
                      <div className="front">
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-8 text-center">
                            <img
                              src={`${Images}/${jugador.equipo?.archivo}`}
                              className="logo w-25"
                              alt={jugador.equipo?.nombre}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-center">
                          <div className="text-center w-75">
                            <table className="table table-borderless w-100">
                              <tbody>
                                <tr>
                                  <th className="text-left text-flip-card-title">
                                    Nombre:
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
                          <div className="col-md-8 text-center">
                            <img
                              src={`${Images}/${jugador.equipo?.archivo}`}
                              className="logo w-25"
                              alt={jugador.equipo?.nombre}
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
                              <span>Volver</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
