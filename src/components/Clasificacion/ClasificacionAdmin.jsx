
import { useEffect, useState } from "react";

import "./index.css";
import axios from "axios";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";

const endpoint = `${API_ENDPOINT}userHomeclassification`;

const Images = IMAGES_URL;


const AdminClasificacion = () => {
  const [datosGrupos, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getGroupsAll = async () => {
      try {
        const response = await axios.get(`${endpoint}?page=${currentPage}`);
        setGroups(response.data.data); 
        setCurrentPage(response.data.current_page); // Página actual
        setLastPage(response.data.last_page); // Última página
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('error al cargar los grupos')
        console.error("Error fetching groups:", error);
      }
    };

    getGroupsAll();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  return (
    <>
    
      {isLoading ? (
        <div className="loading-container">
          <Cargando/>
        </div>
      ) :  error ? (
        <div className="loading-container">
           <ErrorCarga/>
        </div>
      ) : (
        <section>
            <h1>Clasificacion</h1>
          <div className="row">
            {datosGrupos.map((datosGrupo) => (
              <div key={datosGrupo.grupo.id} className="col-12 col-sm-12 col-md-6 mt-4">
                <div className="card border-0 shadow">
                  <div className="card-header fondo-card-admin TITULO-admin  border-0">
                    {datosGrupo.grupo.nombre} 
                  </div>
                  <div className="card table-responsive border-0 table-sm">
                    <table className="table-borderless">
                      <tbody>
                        <tr className="py-2">
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
                        {datosGrupo.equipos.map((equipo, index) => (
                          <tr key={equipo.id} className={index < 2 ? "fila-resaltada" : ""}>
                            <td className="movil data">{index + 1}</td>
                            <td>
                              <img
                                src={`${Images}/${equipo.archivo}`}
                                width="50%"
                                className="d-block mx-auto my-3 logomovil"
                                alt={equipo.nombre}
                              />
                            </td>
                            <td className="movil data text-left team">
                              {equipo.nombre}
                            </td>
                            <td className="movil data">{equipo.pj}</td>
                            <td className="movil data">{equipo.pg}</td>
                            <td className="movil data">{equipo.pe}</td>
                            <td className="movil data">{equipo.pp}</td>
                            <td className="movil data">{equipo.gf}</td>
                            <td className="movil data">{equipo.gc}</td>
                            <td className="movil data">{equipo.gd}</td>
                            <td className="movil data">{equipo.puntos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="pagination mb-4">
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
        </section>
      )}
     
    </>
  );
};

export default AdminClasificacion;






