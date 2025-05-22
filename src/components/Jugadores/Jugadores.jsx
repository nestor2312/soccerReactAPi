import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import "./index.css"; // asegúrate de importar aquí también

const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const Jugadores = () => {
  const { categoriaId, subcategoriaId } = useParams();
  const [jugadores, setJugadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [equipos, setEquipos] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const url = equipoSeleccionado
          ? `${endpoint}subcategoria/${subcategoriaId}/jugadores/paginador?equipo=${equipoSeleccionado}&page=${currentPage}`
          : `${endpoint}subcategoria/${subcategoriaId}/jugadores/paginador?page=${currentPage}`;

        const response = await axios.get(url);
        setJugadores(response.data.jugadores.data);
        setLastPage(response.data.jugadores.last_page);
        setEquipos(response.data.equipos);
      } catch (error) {
        setError("Error al cargar los jugadores.");
        console.error("Error al obtener los datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [subcategoriaId, currentPage, equipoSeleccionado]);

  useEffect(() => {
    document.title = "Jugadores";
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
        ) : jugadores.length > 0 ? (
          <>
            {/* BLOQUE TABLA */}
            <div className="col-sm-12 mt-2 hiden ">
              {/* Filtro */}
              <div className="row mb-4 form-group">
                <div className="col-md-3 ">
                  <label htmlFor="equipoFiltro">Filtrar por equipo:</label>
                  <select
                    id="equipoFiltro"
                    className="form-control form-select border-secundary shadow-sm"
                    value={equipoSeleccionado}
                    onChange={(e) => {
                      setEquipoSeleccionado(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">Todos los equipos</option>
                    {equipos.map((equipo) => (
                      <option key={equipo.id} value={equipo.nombre}>
                        {equipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabla de jugadores */}
              <div className="card border-0 shadow">
                <div className="card-header fondo-card TITULO border-0">
                  Jugadores
                </div>
                <div className="card table-responsive border-0 table-sm">
                  <table className="table-borderless">
                    <thead>
                      <tr>
                        <th></th>
                        <th className="titulo2 text-left">Equipo</th>
                        <th className="titulo2 text-center">Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jugadores.map((player) => (
                        <tr
                          key={player.id}
                          onClick={() =>
                            navigate(
                              `/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores/${player.id}`
                            )
                          }
                        >
                          <td width="10%">
                            <img
                              src={`${Images}/${player.equipo.archivo}`}
                              className="logo"
                              width="100%"
                              alt={player.equipo.nombre}
                            />
                          </td>
                          <td className="text-left team" width="40%">
                            {player.equipo.nombre}
                          </td>
                          <td className="data text-center">
                            {player.nombre} <strong>{player.apellido}</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Paginación */}
              <div className="pagination mt-4 mb-2">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <span>{`Página ${currentPage} de ${lastPage}`}</span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === lastPage}
                >
                  Siguiente →
                </button>
              </div>
            </div>

            {/* BLOQUE CARDS */}
            <section className="margen Jugadores mt-3">
              <div className="container-fluid">
                {/* Filtro alternativa */}
                <div className="row mb-4 form-group hiden2">
                  <div className="col-md-3">
                    <label htmlFor="equipoFiltro">Filtrar por equipo:</label>
                    <select
                      id="equipoFiltro"
                      className="form-control form-select border-secundary shadow-sm"
                      value={equipoSeleccionado}
                      onChange={(e) => {
                        setEquipoSeleccionado(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">Todos los equipos</option>
                      {equipos.map((equipo) => (
                        <option key={equipo.id} value={equipo.nombre}>
                          {equipo.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cards de jugadores */}
                <div className="row hiden2">
                  {jugadores.map((player) => (
                    <div key={player.id} className="col-md-4 mb-2">
                      <div className="team-item2">
                        <div className="card card-matches card-hover d-flex justify-content-center align-items-center">
                          <div className="card-body d-flex justify-content-center align-items-center">
                            <Link
                              to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores/${player.id}`}
                            >
                              <div className="row">
                                <div className="col-7 d-flex align-items-center">
                                  <img
                                    src={`${Images}/${player.equipo.archivo}`}
                                    className="logo2"
                                    alt={player.equipo.nombre}
                                  />
                                  <span className="team">
                                    {player.equipo.nombre}
                                  </span>
                                </div>
                                <div className="col-5 d-flex justify-content-center align-items-center">
                                  <span className="team">
                                    {player.nombre}{" "}
                                    <strong>{player.apellido}</strong>
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginación alternativa */}
                <div className="pagination mb-5 mt-4 hiden2">
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Anterior
                  </button>
                  <span>{`Página ${currentPage} de ${lastPage}`}</span>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={currentPage === lastPage}
                  >
                    Siguiente →
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : (
          <p className="no-datos">
            No hay jugadores disponibles en este momento.
          </p>
        )}
      </main>

      {/* Solo muestro el footer cuando ya no estoy cargando */}
      {!isLoading && !error && <Footer />}
    </div>
  );
};

export default Jugadores;
