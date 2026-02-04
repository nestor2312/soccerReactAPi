import { useEffect, useState, useRef } from "react";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import "./index.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import ErrorLogo from "../../assets/Vector.svg";
const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const Partidos = () => {

  


  
  const { subcategoriaId } = useParams();
  const [partidos, setPartidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedPartido, setSelectedPartido] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const getPartidos = async () => {
      try {
        const response = await axios.get(
          `${endpoint}subcategoria/${subcategoriaId}/partidos/paginador?page=${currentPage}`
        );
        setPartidos(response.data.data);
        setLastPage(response.data.last_page);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Error al cargar los partidos");
        console.error("Error al obtener los partidos:", error);
      }
    };
    getPartidos();
  }, [subcategoriaId, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  useEffect(() => {
    document.title = "Partidos";
  }, []);

  // Función para abrir el modal
  const handleOpenModal = (partido) => {
    setSelectedPartido(partido);
    if (modalRef.current) {
      modalRef.current.showModal(); // Abre el modal
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setSelectedPartido(null);
    if (modalRef.current) {
      modalRef.current.close(); // Cierra el modal
    }
  };

  // ... estados existentes

const [eventos, setEventos] = useState([]); // Ponlo aquí


// MUEVE EL EFECTO AQUÍ ABAJO (Después de handleOpenModal)
useEffect(() => {
  let isMounted = true; // Para evitar actualizar estados de componentes desmontados

  if (selectedPartido?.id) {
    const fetchEventos = async () => {
      try {
        const res = await axios.get(`${endpoint}partidos/${selectedPartido.id}/eventos`);
        if (isMounted) setEventos(res.data || []);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      }
    };
    fetchEventos();
  } else {
    setEventos([]); 
  }

  return () => { isMounted = false; }; // Cleanup
}, [selectedPartido]);

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
      ) : partidos.length > 0 ? (
        <main className="main-content mx-2">
          <div className="col-sm-12 mt-4 hiden">
            <div className="card border-0 shadow ">
              <div className="card-header fondo-card TITULO border-0">
                Partidos
              </div>
              <div className="card table-responsive border-0 table-sm">
                <table className="table-borderless">
                  <thead className="mt-2 mb-2">
                    <tr>
                      <th></th>
                      <th className="titulo2 text-left">Local</th>
                      <th></th>
                      <th className="titulo2 text-right">Visitante</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidos.map((partido) => (
                      <tr
                        key={partido.id}
                        onClick={() => handleOpenModal(partido)}
                      >
                        <td width="10%">
                          <img
                            src={`${Images}/${partido.equipo_a?.archivo}`}
                            className="logo"
                            width="100%"
                            alt={partido.equipo_a?.nombre}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                          />
                        </td>
                        <td className="text-left team" width="30%">
                          {partido.equipo_a?.nombre}
                        </td>
                        <td className="text-center" width="20%">
                          {partido.marcador1 == null ||
                          partido.marcador2 == null ? (
                            <div>
                              <span className="fecha">{partido.fecha || 'VS'}</span>
                              <span className="hora">
                                {partido.hora?.slice(0, 5)}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span className="data text-right">
                                {partido.marcador1}
                              </span>
                              <span className="data"> - </span>
                              <span className="data text-left">
                                {partido.marcador2}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="textright team" width="30%">
                          {partido.equipo_b?.nombre}
                        </td>
                        <td width="10%">
                          <img
                            src={`${Images}/${partido.equipo_b?.archivo}`}
                            className="logo"
                            width="100%"
                            alt={partido.equipo_b?.nombre}
                             onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginación */}
            <div className="pagination mt-4 ">
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

          {/* Cards de partidos */}
          <section className="Partidos hiden-box">
            <div className="margen mt-4">
              <div className="row">
                {partidos.map((partido) => (
                  <div
                    className="col-md-4 mb-4"
                    key={partido.id}
                    onClick={() => handleOpenModal(partido)}
                  >
                    <div className="card card-matches d-flex justify-content-center align-items-center">
                      <div className="card-body d-flex justify-content-center align-items-center">
                        <div className="row">
                          <div className="col-4 d-flex justify-content-start align-items-center">
                            <img
                              src={`${Images}/${partido.equipo_a?.archivo}`}
                              className="logo2 TeamLocal"
                              alt={partido.equipo_a?.nombre}
                               onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                            />
                            <span className="team">
                              {partido.equipo_a?.nombre}
                            </span>
                          </div>
                          <div className="col-4 d-flex flex-wrap align-content-around justify-content-center">
                            <span className="score">
                              {partido.marcador1 == null ||
                              partido.marcador2 == null ? (
                                <>
                                  <span className="fecha">{partido.fecha || 'VS'}</span>
                                  <span className="hora">
                                    {partido.hora?.slice(0, 5)}
                                  </span>
                                </>
                              ) : (
                                `${partido.marcador1} - ${partido.marcador2}`
                              )}
                            </span>
                          </div>
                          <div className="col-4 d-flex justify-content-end align-items-center">
                            <span className="team">
                              {partido.equipo_b?.nombre}
                            </span>
                            <img
                              src={`${Images}/${partido.equipo_b?.archivo}`}
                              className="logo2 TeamVisitante"
                              alt={partido.equipo_b?.nombre}
                               onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Paginación */}
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
            </div>
          </section>

          {/* Modal */}
          <dialog ref={modalRef}>
            {selectedPartido && (
              <>
                {/* Botón de cierre mejorado */}
                <button
                  type="button"
                  className="close-button btn btn-outline-danger"
                  onClick={handleCloseModal}
                >
                  X
                </button>

                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <div className="row dialog-box">
                    <div className="col-sm-4 col-4 d-flex justify-content-start align-items-center">
                      <img
                        src={`${Images}/${selectedPartido.equipo_a?.archivo}`}
                        className="logo2 TeamLocal"
                        alt={selectedPartido.equipo_a?.nombre || "Equipo A"}
                         onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                      />
                      <span className="team">
                        {selectedPartido.equipo_a?.nombre || "Equipo A"}
                      </span>
                    </div>
                    <div className="col-sm-4 col-4 d-flex flex-wrap align-content-around justify-content-center text-center">
                      <span className="scoremodal">
                        {selectedPartido.marcador1 == null ||
                        selectedPartido.marcador2 == null ? (
                          <>
                            <h2 className="scoremodal">VS</h2>
                          </>
                        ) : (
                          `${selectedPartido.marcador1} - ${selectedPartido.marcador2}`
                        )}
                      </span>
                    </div>
                    <div className="col-sm-4 col-4 d-flex justify-content-end align-items-center">
                      <span className="team">
                        {selectedPartido.equipo_b?.nombre || "Equipo B"}
                      </span>
                      <img
                        src={`${Images}/${selectedPartido.equipo_b?.archivo}`}
                        className="logo2 TeamVisitante"
                        alt={selectedPartido.equipo_b?.nombre || "Equipo B"}
                         onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <h1 className="fecha">{selectedPartido.fecha || 'Fecha por definir' }</h1>
                    <h4 className="hora">
                      {selectedPartido.hora?.slice(0, 5)}
                    </h4>
                  </div>
                </div>

                <div className="eventos-timeline w-100 border-top pt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
    {/* <h6 className="text-center text-uppercase text-muted small mb-3">Incidencias del partido</h6> */}
    
    {eventos.length === 0 ? (
      <p className="text-center text-muted small"> </p>
    ) : (
      <div className="list-group list-group-flush">
        <div className="eventos-timeline pt-3">
  <h6 className="text-center text-uppercase text-muted small mb-4">Detalles del partido</h6>

  <div className="row g-0">
    {/* COLUMNA EQUIPO LOCAL (A) */}
    <div className="col-6 border-right" style={{ borderRight: '2px solid #eee', color: '#ffffff' }}>
      <div className="list-group list-group-flush pr-2">
        {eventos
          .filter((e) => e.equipo_id === selectedPartido.equipoA_id)
          .map((e) => (
            <div key={e.id} className="mb-3 fondo-imagen  d-flex flex-column align-items-start">
              <div className="d-flex align-items-center mb-1">
                <span className="badge badge-dark mr-2" style={{ fontSize: '0.7rem' }}>
                  {e.minuto ? `${e.minuto}'` : '-'}
                </span>
                <span className="evento-icono mr-1">
                  {e.tipo_evento === 'gol' && '⚽'}
                  {e.tipo_evento === 'amarilla' && '🟨'}
                  {e.tipo_evento === 'roja' && '🟥'}
                  {e.tipo_evento === 'asistencia' && '👟'}
                </span>
                <strong className="font-events-matches" style={{ marginLeft: '4px', textTransform: 'capitalize' }}>{e.jugador?.nombre}  {e.jugador?.apellido}</strong>
              </div>
<small style={{ marginLeft: '48px', marginTop: '-11px', fontSize: '0.75rem', color: '#ffffff', display: 'block', textTransform: 'capitalize' }}>                {e.tipo_evento}
              </small>
            </div>
          ))}
      </div>
    </div>

    {/* COLUMNA EQUIPO VISITANTE (B) */}
    <div className="col-6">
      <div className="list-group list-group-flush  pl-2">
        {eventos
          .filter((e) => e.equipo_id === selectedPartido.equipoB_id)
          .map((e) => (
            <div key={e.id} className="mb-3 d-flex fondo-imagen flex-column align-items-end text-right">
              <div className="d-flex align-items-center  mb-1 flex-row-reverse">
                <span className="badge badge-dark ml-2" style={{ fontSize: '0.7rem',  color: '#ffffff' }}>
                  {e.minuto ? `${e.minuto}'` : '-'}
                </span>
                <span className="evento-icono ml-1">
                  {e.tipo_evento === 'gol' && '⚽'}
                  {e.tipo_evento === 'amarilla' && '🟨'}
                  {e.tipo_evento === 'roja' && '🟥'}
                  {e.tipo_evento === 'asistencia' && '👟'}
                </span>
                <strong className="font-events-matches">{e.jugador?.nombre} {e.jugador?.apellido}</strong>
              </div>
              <small className=" text-capitalize" style={{ marginRight: '45px',  marginTop: '-11px',  color: '#ffffff', fontSize: '0.7rem' }}>
                {e.tipo_evento}
              </small>
            </div>
          ))}
      </div>
    </div>
  </div>

  {eventos.length === 0 && (
    <p className="text-center text-muted small mt-2">No hay incidencias registradas</p>
  )}
</div>
      </div>
    )}
  </div>
                
                
              </>
            )}
          </dialog>
        </main>
      ) : (
        <p className="no-datos">No hay Partidos disponibles en este momento.</p>
      )}
      {!isLoading && !error && <Footer />}
    </div>
  );
};

export default Partidos;
