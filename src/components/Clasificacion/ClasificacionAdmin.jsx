/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";
import ErrorLogo from "../../assets/Vector.svg";
const endpoint = `${API_ENDPOINT}userHomeclassification`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;
const Images = IMAGES_URL;

const AdminClasificacion = () => {
  const [datosGrupos, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [subcategorias, setSubcategorias] = useState([]);

  // 🔹 Filtro por subcategoría
 // 🔹 Manejar cambio de subcategoría
const handleSubcategoriaChange = (e) => {
  const subcategoriaId = e.target.value;
  setSelectedSubcategoria(subcategoriaId);
  setCurrentPage(1); // Reinicia a la primera página al filtrar
};

// 🔹 Cargar grupos (con paginación + filtro)
useEffect(() => {
  const fetchGroups = async () => {
    try {
      setIsLoading(true);

      let url;
      if (selectedSubcategoria) {
        url = `${API_ENDPOINT}userHomeclassification/${selectedSubcategoria}?page=${currentPage}`;
      } else {
        url = `${API_ENDPOINT}userHomeclassification?page=${currentPage}`;
      }

      const response = await axios.get(url);
      setGroups(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("Error al cargar los grupos");
      console.error("Error fetching groups:", error);
    }
  };

  fetchGroups();
}, [currentPage, selectedSubcategoria]);


  // 🔹 Cargar grupos iniciales
  useEffect(() => {
    const getGroupsAll = async () => {
      try {
       const response = await axios.get(`${API_ENDPOINT}userHomeclassification?page=${currentPage}`);

        setGroups(response.data.data);
        setCurrentPage(response.data.current_page);
        setLastPage(response.data.last_page);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('Error al cargar los grupos');
        console.error("Error fetching groups:", error);
      }
    };

    getGroupsAll();
  }, [currentPage]);

  // 🔹 Cargar subcategorías
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await axios.get(subcategoriasEndpoint);
        setSubcategorias(response.data);
      } catch (error) {
        console.error("Error al cargar subcategorías:", error);
      }
    };

    fetchSubcategorias();
  }, []);

  // 🔹 Paginación (mejorada)
  const handlePageChange = async (page) => {
    setCurrentPage(page);
    setIsLoading(true);

    try {
      let response;
      if (selectedSubcategoria) {
        response = await axios.get(`${API_ENDPOINT}userHomeclassification/${selectedSubcategoria}?page=${page}`);
      } else {
        response = await axios.get(`${endpoint}?page=${page}`);
      }

      setGroups(response.data.data);
      setCurrentPage(response.data.current_page);
      setLastPage(response.data.last_page);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al cambiar de página:", error);
    }
  };

  useEffect(() => {
    document.title = "Admin - Clasificación";
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container"><Cargando /></div>
      ) : error ? (
        <div className="loading-container"><ErrorCarga /></div>
      ) : (
        <section>
          <h1>Clasificación</h1>
          <h3 className="mt-4 mb-3">Filtrar por grupo</h3>

          <select id="subcategoria" className="form-control mb-4" onChange={handleSubcategoriaChange}>
            <option value="">Seleccione una subcategoría</option>
            {subcategorias.map((subcategoria) => (
              <option key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.nombre} - {subcategoria.categoria?.torneo?.nombre}
              </option>
            ))}
          </select>

          <div className="row">
            {datosGrupos.map((datosGrupo) => (
              <div key={datosGrupo.grupo.id} className="col-12 col-sm-12 col-md-6 mt-4">
                <div className="card border-0 shadow">
                  <div className="card-header fondo-card-admin TITULO-admin border-0">
                    {datosGrupo.grupo.nombre} - {datosGrupo.grupo.subcategoria?.nombre ?? 'Sin subcategoría'} - 
                    <span className="text-muted"> 
                       {datosGrupo.grupo.subcategoria?.categoria?.nombre ?? 'Sin categoría'} - {datosGrupo.grupo.subcategoria?.categoria?.torneo?.nombre ?? 'Sin torneo'}
                    </span>
                  </div>

                  <div className="card table-responsive border-0 table-sm">
                    <table className="table-borderless">
                      <tbody>
                        <tr className="py-2">
                          <td></td><td></td><td></td>
                          <th className="movil titulo2">PJ</th>
                          <th className="movil titulo2">PG</th>
                          <th className="movil titulo2">PE</th>
                          <th className="movil titulo2">PP</th>
                          <th className="movil titulo2">GF</th>
                          <th className="movil titulo2">GC</th>
                          <th className="movil titulo2">GD</th>
                          <th className="movil titulo2">Pts</th>
                        </tr>

                        {datosGrupo.equipos.map((equipo, index) => {
                          const numClasificados = datosGrupo.grupo.num_clasificados || 0;
                          return (
                            <tr key={equipo.id} className={index < numClasificados ? "fila-resaltada" : ""}>
                              <td className="movil data">{index + 1}</td>
                              <td>
                                <img
                                  src={`${Images}/${equipo.archivo}`}
                                  width="5%"
                                  className="d-block mx-auto my-3 logo logomovil"
                                  alt={equipo.nombre}
                                   onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = ErrorLogo; 
                                                    e.target.classList.add("error-logo");
                                                  }}
                                />
                              </td>
                              <td className="movil text-left team" width="25%">
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
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination mb-4">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>← Anterior</button>
            <span>{`Página ${currentPage} de ${lastPage}`}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>Siguiente →</button>
          </div>
        </section>
      )}
    </>
  );
};

export default AdminClasificacion;
