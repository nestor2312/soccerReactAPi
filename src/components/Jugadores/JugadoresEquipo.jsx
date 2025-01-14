import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";

const JugadoresEquipo = () => {
  const { equipoId, categoriaId, subcategoriaId } = useParams(); // Traer todos los parámetros desde la URL
  const [equipo, setEquipo] = useState(null); // Información del equipo y jugadores
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Manejo de errores

  useEffect(() => {
    const fetchEquipoYJugadores = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}equipos/${equipoId}/jugadores`
        );
        setEquipo(response.data);
      } catch (error) {
        setError("Error al cargar los datos.");
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEquipoYJugadores();
  }, [equipoId]);
  useEffect(() => {
    document.title = "Jugadores";
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
      ) : equipo ? (
        <div className="container mt-4">
          <div className="text-center">
            {/* Imagen y nombre del equipo */}
            <img
              src={`${IMAGES_URL}/${equipo.archivo}`}
              alt={equipo.nombre}
              width="100px"
              className="my-3"
            />
            <h2 className="text-capitalize">{equipo.nombre}</h2>
          </div>
          <h3 className="mt-4 text-center">Jugadores</h3>
          <div className="row">
            {equipo.jugadores.map((Player) => (
                  <div key={Player.id} className="col-md-4 mb-2">
                          <div className="team-item2">
                <Link to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores/${Player.id}`}>
                            <div className="card card-matches card-hover d-flex justify-content-center align-items-center">
                              <div className="card-body d-flex justify-content-center align-items-center">
              
              
                    <div>

                  <div className="row">
                  <div className="col-7 d-flex justify-content-around align-items-center">
                                    <img
                                      src={`${IMAGES_URL}/${equipo.archivo}`}
                                      className="logo2"
                                      alt={equipo.nombre} />
                                    <span className="team"><strong>{Player.numero}</strong></span>
                                  </div>
                                  <div className="col-5 d-flex justify-content-center align-items-center">
                                    <span className="team">{Player.nombre}  <strong>{Player.apellido}</strong></span>
                                  </div>
                  </div>
                    </div>

                 
              </div>
              </div>
                </Link>
              </div>
              </div>
             
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">El equipo no tiene jugadores registrados.</p>
      )}
      <Footer />
    </>
  );
};

export default JugadoresEquipo;
