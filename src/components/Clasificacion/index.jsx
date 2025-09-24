import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menu from "../Menu/Menu";
import "./index.css";
import axios from "axios";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import Footer from "../Footer/Footer";
import ErrorLogo from "../../assets/Vector.svg";

const Clasificacion = () => {
  const { subcategoriaId } = useParams();
  const [datosGrupos, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    // console.log('Página actual:', currentPage);
  }, [currentPage]);

  useEffect(() => {
    // console.log('Página siguiente:', lastPage);
  }, [lastPage]);

  useEffect(() => {
    const getGroupsAll = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}subcategoria/${subcategoriaId}/clasificacion?page=${currentPage}`
        );

        const { data, current_page, last_page } = response.data;
        setGroups(data);
        setCurrentPage(current_page);
        setLastPage(last_page);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Error al cargar los grupos");
        console.error("Error fetching groups:", error);
      }
    };

    getGroupsAll();
  }, [currentPage, subcategoriaId]);

  useEffect(() => {
    document.title = "Clasificacion";
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
      setIsLoading(true);
    }
  };

  return (
    <div className="layout">
      <Menu />
      {isLoading ? (
        <div className="loading-container">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container">
          <ErrorCarga />
        </div>
      ) : (
        <main className="main-content">
          <section className="margen ">
            <div className="row">
              {datosGrupos && datosGrupos.length > 0 ? (
                datosGrupos.map((datosGrupo, index) => (
                  <div
                    key={index}
                    className={`col-12 col-sm-12 ${
                      datosGrupos.length === 1 ? "col-md-12" : "col-md-6"
                    } mt-4`}
                  >
                    <div className="card border-0 shadow">
                      <div className="card-header fondo-card TITULO border-0 text-capitalize">
                        {datosGrupo.grupo.nombre}  
                      </div>
                      <div className="card table-responsive border-0 table-sm">
                        <table className="table-borderless">
                          <tbody>
                            <tr>
                              <td></td>
                              <td></td>
                              <td></td>
                              <th className="movil titulo2">PJ</th>
                              <th className="movil titulo2">PG</th>
                              <th className="movil titulo2">PE</th>
                              <th className="movil titulo2">PP</th>
                              <th className="movil titulo2">GF</th>
                              <th className="movil titulo2">GC</th>
                              <th className="movil titulo2 ">GD</th>
                              <th className="movil titulo2">Pts</th>
                            </tr>
                            {datosGrupo.equipos.map((equipo, index) => {
                              const numClasificados =
                                datosGrupo.grupo.num_clasificados || 0;
                              return (
                                <tr
                                  key={equipo.id}
                                  className={
                                    index < numClasificados
                                      ? "fila-resaltada"
                                      : ""
                                  }
                                >
                                  <td className="movil data">{index + 1}</td>
                                  <td>
                                    <img
                                      src={`${IMAGES_URL}/${equipo.archivo}`}
                                      width="5%"
                                      className="logo logomovil"
                                      alt={equipo.nombre}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = ErrorLogo;
                                      
                                      }}
                                    />
                                  </td>
                                  <td
                                    className="movil text-left team"
                                    width="25%"
                                  >
                                    {equipo.nombre}
                                  </td>
                                  <td className="movil data">{equipo.pj}</td>
                                  <td className="movil data">{equipo.pg}</td>
                                  <td className="movil data">{equipo.pe}</td>
                                  <td className="movil data">{equipo.pp}</td>
                                  <td className="movil data">{equipo.gf}</td>
                                  <td className="movil data">{equipo.gc}</td>
                                  <td className="movil data">{equipo.gd}</td>
                                  <td className="movil data">
                                    {equipo.puntos}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay datos disponibles.</p>
              )}
            </div>
            {datosGrupos && datosGrupos.length > 0 && (
              <div className="pagination mt-4 mb-3">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading || currentPage < 1}
                >
                  ← Anterior
                </button>
                <span>{`Página ${currentPage || 1} de ${lastPage || 1}`}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === lastPage || isLoading}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </section>
        </main>
      )}
      {!isLoading && !error && <Footer />}
    </div>
  );
};

export default Clasificacion;
