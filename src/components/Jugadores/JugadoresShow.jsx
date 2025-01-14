import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";
import { useParams } from "react-router-dom"; 
import "./index.css";

const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const JugadorShow = () => {
  const { jugadorId } = useParams(); 
  const [jugador, setJugador] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const getJugador = async () => {
      try {
        const response = await axios.get(`${endpoint}jugadores/${jugadorId}`);
        setJugador(response.data); 
        setIsLoading(false);  
      } catch (error) {
        setIsLoading(false);
        setError("Error al cargar el jugador.");
        console.error("Error al obtener el jugador:", error);
      }
    };

    if (jugadorId) {
      getJugador(); 
    }
  }, [jugadorId]); 

  useEffect(() => {
    document.title = "Jugador detalles";
  }, []);

  return (
    <>
      <Menu />
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
            <div className="row d-flex justify-content-center align-items-center">
              <div className="col-12">
                <div className="col-12 col-md-6 mt-5 mb-5">
                  <div className="card border-0 shadow flashcard d-flex align-items-center">
                    <div className={`card-body ${isFlipped ? "flipped" : ""}`}>
                      <div className="front">
                        <img
                          src={`${Images}/${jugador.equipo?.archivo}`}
                          className="logo"
                          alt={jugador.equipo?.nombre}
                        />
                        <div className="row">
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush text-right">
                              <li className="list-group-item border-0 titulo2">Nombre:</li>
                              <li className="list-group-item border-0 titulo2">Equipo:</li>
                              <li className="list-group-item border-0 titulo2">Edad:</li>
                              <li className="list-group-item border-0 titulo2">Número:</li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush text-right">
                              <li className="list-group-item border-0 score text-capitalize">{jugador.nombre}</li>
                              <li className="list-group-item border-0 score text-capitalize">{jugador.equipo.nombre}</li>
                              <li className="list-group-item border-0 score">{jugador.edad}</li>
                              <li className="list-group-item border-0 score">{jugador.numero}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-8 text-center">
                            <button className="btn-flip  flip" onClick={handleFlip}>
                              <span>Estadísticas</span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="back">
                        <div className="row">
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush text-right">
                              <li className="list-group-item border-0 text-flip-card-title ">Goles:</li>
                              <li className="list-group-item border-0 text-flip-card-title">Asistencias:</li>
                              <li className="list-group-item border-0 text-flip-card-title">T. Amarillas:</li>
                              <li className="list-group-item border-0 text-flip-card-title">T. Rojas:</li>
                            </ul>
                          </div>
                          <div className="col-md-6">
                            <ul className="list-group list-group-flush text-right">
                              <li className="list-group-item border-0 score text-flip-card text-capitalize">{jugador.goles}</li>
                              <li className="list-group-item border-0 score text-capitalize">{jugador.asistencias}</li>
                              <li className="list-group-item border-0 score">{jugador.card_amarilla}</li>
                              <li className="list-group-item border-0 score">{jugador.card_roja}</li>
                            </ul>
                          </div>
                        </div>
                        <div className="row mt-3 justify-content-center">
                          <div className="col-md-12 text-center">
                            <button  className="btn-flip flip" onClick={handleFlip}>
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
          </div>
        </section>
      ) : (
        <p className="no-datos">No hay Jugadores disponibles en este momento.</p>
      )}
      <Footer />
    </>
  );
};

export default JugadorShow;
