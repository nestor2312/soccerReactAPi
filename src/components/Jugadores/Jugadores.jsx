import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";

const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const Jugadores = () => {
  const { categoriaId, subcategoriaId } = useParams();
  const [jugadores, setJugadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [equipos, setEquipos] = useState([]); // Lista de equipos
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(""); // Filtro de equipo

  // Obtener jugadores desde la API con paginación
  useEffect(() => {
    const getJugadores = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/jugadores/paginador?page=${currentPage}`);
        const jugadoresData = response.data.data;
        setJugadores(jugadoresData);

        // Generar la lista de equipos única desde los jugadores
        const equiposUnicos = [...new Set(jugadoresData.map((player) => player.equipo.nombre))];
        setEquipos(equiposUnicos);
      
        setLastPage(response.data.last_page); // Actualiza el total de páginas desde la API
      } catch (error) {
        setError("Error al cargar los jugadores.");
        console.error("Error al obtener los jugadores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getJugadores();
  }, [subcategoriaId, currentPage]);

  // Cambiar página
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  // Filtrar jugadores según el equipo seleccionado
  const jugadoresFiltrados = equipoSeleccionado
    ? jugadores.filter((player) => player.equipo.nombre === equipoSeleccionado)
    : jugadores;

  // Cambiar título del documento
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
      ) : jugadores.length > 0 ? (

            <><div className="col-sm-12 mt-2 hiden mb-5">
                 {/* Filtro de equipo */}
                 <div className="row mb-4  form-group ">
                    <div className="col-md-3">
                      <label htmlFor="equipoFiltro">Filtrar por equipo:</label>
                      <select
                        id="equipoFiltro"
                        className="form-control"
                        value={equipoSeleccionado}
                        onChange={(e) => setEquipoSeleccionado(e.target.value)}
                      >
                        <option value="">Todos los equipos</option>
                        {equipos.map((equipo, index) => (
                          <option className="text-capitalize" key={index} value={equipo}>
                            {equipo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
              <div className="card border-0 shadow">
                <div className="card-header fondo-card TITULO border-0">Jugadores</div>
                <div className="card table-responsive border-0 table-sm">
                  <table className="table-borderless">
                    <thead>
                      <th></th>
                      <th className="titulo2 text-left">Equipo</th>
                    
                      <th className="titulo2 text-center">Nombre</th>
                      <th></th>
                    </thead>
                    <tbody>
                    {jugadoresFiltrados.map((Player) => (
                        <tr key={Player.id} width="10%">
                          <td width="10%">
                            <img
                             src={`${Images}/${Player.equipo.archivo}`}
                              className="logo" width="100%"
                              alt={Player.equipo.nombre} />                
                          </td>
                          <td className="text-left team " width="40%">{Player.equipo.nombre}</td>
                          <td className=" data text-center"> {Player.nombre}</td>                  
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Paginación */}
              <div className="pagination mb-5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Anterior
                </button>
                <span>{`Página ${currentPage} de ${lastPage}`}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage}
                >
                  Siguiente →
                </button>
              </div>
            </div><section className="margen Jugadores mt-4">
                <div className="container-fluid">
                  {/* Filtro de equipo */}
                  <div className="row mb-4  form-group hiden2">
                    <div className="col-md-3">
                      <label htmlFor="equipoFiltro">Filtrar por equipo:</label>
                      <select
                        id="equipoFiltro"
                        className="form-control"
                        value={equipoSeleccionado}
                        onChange={(e) => setEquipoSeleccionado(e.target.value)}
                      >
                        <option value="">Todos los equipos</option>
                        {equipos.map((equipo, index) => (
                          <option key={index} value={equipo}  className="text-capitalize">
                            {equipo}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Lista de jugadores filtrados */}
                  <div className="row hiden2">
                    {jugadoresFiltrados.map((Player) => (
                      <div key={Player.id} className="col-md-4 mb-2">
                        <div className="team-item2">
                          <div className="card card-matches card-hover d-flex justify-content-center align-items-center">
                            <div className="card-body d-flex justify-content-center align-items-center">
                              <Link to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores/${Player.id}`}>
                                <div className="row">
                                  <div className="col-7 d-flex justify-content-around align-items-center">
                                    <img
                                      src={`${Images}/${Player.equipo.archivo}`}
                                      className="logo2"
                                      alt={Player.equipo.nombre} />
                                    <span className="team">{Player.equipo.nombre}</span>
                                  </div>
                                  <div className="col-5 d-flex justify-content-center align-items-center">
                                    <span className="team">{Player.nombre} {Player.apellido}</span>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Paginación */}
                  <div className="pagination mb-4 hiden2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Anterior
                    </button>
                    <span>{`Página ${currentPage} de ${lastPage}`}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lastPage}
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              </section></>
      ) : (
        <p className="no-datos">No hay jugadores disponibles en este momento.</p>
      )}
      <Footer />
    </>
  );
};

export default Jugadores;
