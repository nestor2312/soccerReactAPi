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

  const [vista, setVista] = useState('todos'); // 'todos' o 'por_jornada'
const [jornadaSeleccionada, setJornadaSeleccionada] = useState(null);

const listaJornadas = [...new Set(partidos.map(p => p.jornada).filter(j => j !== null))];
const [calendario, setCalendario] = useState({});
const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]); // Hoy por defecto
useEffect(() => {
    const getCalendario = async () => {
      try {
        const res = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/partidos-calendario`);
        setCalendario(res.data || {});
      } catch (err) {
        console.error("Error en calendario:", err);
      }
    };
    if (subcategoriaId) getCalendario();
  }, [subcategoriaId]);

const seleccionarFechaMasCercana = () => {
  const fechasValidas = Object.keys(calendario).filter(f => 
    f && f !== "null" && f !== "undefined" && f !== ""
  );

  if (fechasValidas.length === 0) return;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // 1. Intentamos buscar la primera fecha que sea hoy o futura
  const fechasFuturas = fechasValidas
    .map(f => new Date(f + 'T00:00:00'))
    .filter(d => d >= hoy)
    .sort((a, b) => a - b); // Ordenar de más cercana a más lejana

  if (fechasFuturas.length > 0) {
    // Si hay partidos futuros, mostramos el primero (el más próximo)
    setFechaSeleccionada(fechasFuturas[0].toISOString().split('T')[0]);
  } else {
    // Si NO hay partidos futuros (terminó el torneo), mostramos el último que hubo
    const ultimaFecha = fechasValidas.sort().reverse()[0];
    setFechaSeleccionada(ultimaFecha);
  }
};


useEffect(() => {
  const getPartidos = async () => {
    try {
      setIsLoading(true);
      const url = vista === 'todos' 
        ? `${endpoint}subcategoria/${subcategoriaId}/partidos/paginador?page=${currentPage}`
        : `${endpoint}subcategoria/${subcategoriaId}/partidos`; 

      const response = await axios.get(url);
      
      if (vista === 'todos') {
        // Estructura con paginación de Laravel
        setPartidos(response.data.data || []);
        setLastPage(response.data.last_page || 1);
      } else {
        // Estructura sin paginación (get)
        setPartidos(response.data || []);
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar");
    } finally {
      setIsLoading(false);
    }
  };
  getPartidos();
}, [subcategoriaId, currentPage, vista]);

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

const scrollRef = useRef(null); // Para el contenedor de botones
const hoyRef = useRef(null);   // Para el botón de "Hoy"


useEffect(() => {
  // Solo actuamos si el usuario entra a la vista 'diario'
  if (vista === 'diario') {
    
    const ejecutarScroll = () => {
      if (hoyRef.current) {
        hoyRef.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    };

    // Si el calendario ya tiene datos, intentamos el scroll
    if (Object.keys(calendario).length > 0) {
      // Damos un tiempo para que React termine de montar los botones en el DOM
      const timer = setTimeout(ejecutarScroll, 200); 
      return () => clearTimeout(timer);
    }
  }
}, [vista, calendario, fechaSeleccionada]); // Al incluir 'vista', se dispara cada vez que cambias de botón


const formatearFechaCabecera = (fechaStr) => {
  if (!fechaStr || fechaStr === "null" || fechaStr === "undefined") {
    return "Fecha por definir";
  }
  
  const fechaObj = new Date(fechaStr + 'T00:00:00');
  
  // Si por alguna razón el string no es una fecha válida (ej: "abc")
  if (isNaN(fechaObj.getTime())) {
    return "Fecha por definir";
  }

  return fechaObj.toLocaleDateString('es-CO', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
};


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

const partidosAMostrar = vista === 'todos' 
  ? partidos 
  : (jornadaSeleccionada 
      ? partidos.filter(p => p.jornada === jornadaSeleccionada) 
      : []); // Si no hay jornada seleccionada y está en modo jornadas, mostramos vacío o un mensaje

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


        
        <main className="main-content mx-1">
<div className="d-flex justify-content-center mb-4 mt-3">
  <div className="d-flex flex-nowrap overflow-auto pb-2 scroll-tabs" style={{ maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
    
    <button 
      className={`btn-tab mx-1 ${vista === 'diario' ? 'active' : ''}`} 
      onClick={() => { setVista('diario'); setCurrentPage(1); }}
    >
      Calendario
    </button>
    
    <button 
      className={`btn-tab mx-1 ${vista === 'todos' ? 'active' : ''}`} 
      onClick={() => setVista('todos')}
    >
      Todos los partidos
    </button>

    <button 
      className={`btn-tab mx-1 ${vista === 'por_jornada' ? 'active' : ''}`} 
      onClick={() => setVista('por_jornada')}
    >
      Ver jornadas
    </button>

  </div>
</div>

{vista === 'diario' && (
  <div className="calendario-contenedor container mt-4">
    {/* 1. FILA DE BOTONES DE FECHAS */}
    <div 
   ref={scrollRef} // <--- REFERENCIA AQUÍ
  className="d-flex overflow-auto pb-3 mb-4 gap-2 scroller-fechas" 
  style={{ whiteSpace: 'nowrap', scrollBehavior: 'smooth' }}>
    {Object.keys(calendario).length > 0 ? (
        Object.keys(calendario).sort().map((fecha) => {
          const esHoy = fecha === new Date().toISOString().split('T')[0];
          const fechaValida = fecha && fecha !== "null";
         
          return (
       <button
  key={fecha}
  ref={(el) => {
    if (el && fecha === fechaSeleccionada && vista === 'diario') {
      // Este código se ejecuta en cuanto el botón se dibuja en el DOM
      el.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }}
  className={`btn-jornada ${fechaSeleccionada === fecha ? 'active' : ''}`}
  onClick={() => setFechaSeleccionada(fecha)}
>
              <div className="small text-uppercase" style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                {esHoy ? "Hoy" : (fechaValida ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { weekday: 'short' }) : "---")}
              </div>
              <div className="font-weight-bold">
                {fechaValida 
                  ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) 
                  : "Fecha por definir"}
              </div>
            </button>
          );
        })
      ) : (
        <p className="text-center w-100">Cargando fechas...</p>
      )}
    </div>

    {/* 2. CONTENIDO DE LA FECHA SELECCIONADA */}
    <div className="dia-seccion animate__animated animate__fadeIn">
      {calendario[fechaSeleccionada] ? (
        <>
        <div className="d-flex align-items-center  mb-3">
              <div style={{ width: '4px', height: '20px', background: '#00bf63cc', marginRight: '10px', borderRadius:'10px' }}></div>
              <h4 className="text-uppercase fw-bold m-0  " style={{ fontSize: '0.9rem', color: '#000000' }}>
                {formatearFechaCabecera(fechaSeleccionada)} 
              </h4>
            </div>
       
          
          <div className="row">
          {calendario[fechaSeleccionada].map(partido => (
           <div key={partido.id} className="col-md-4 col-lg-4 mb-3" onClick={() => handleOpenModal(partido)}>
  
  <div 
    className="card card-matches shadow-sm p-3 h-100"
    style={{ 
      cursor: 'pointer', 
      borderRadius: '12px', 
      border: 'none'
    }}
  >

    <div className="d-flex justify-content-between align-items-center">

      {/* LOCAL */}
      <div className="d-flex align-items-center" style={{ width: '30%', gap: '8px', minWidth: 0 }}>
        
        {/* Línea izquierda */}
        <div 
          style={{ 
            width: '4px', 
            height: '45px', 
            background: `linear-gradient(180deg, #E0E0E0, ${partido.equipo_a?.color_hover})`,
            borderRadius: '10px'
          }}
        ></div>

        {/* Logo + Nombre */}
        <div className="d-flex align-items-center" style={{ gap: '6px', minWidth: 0 }}>
          
          <img 
            src={`${Images}/${partido.equipo_a?.archivo}`} 
            width="36" 
            height="36" 
            style={{ objectFit: 'contain' }} 
            onError={e => e.target.src = ErrorLogo} 
            alt=""
          />

          <span 
            className="small font-weight-bold text-truncate"
            style={{ maxWidth: '90px' }}
            title={partido.equipo_a?.nombre}
          >
            {partido.equipo_a?.nombre}
          </span>

        </div>
      </div>

      {/* CENTRO */}
      <div className="text-center flex-grow-1">
        <span 
          className="badge mb-1"
          style={{
            backgroundColor: '#00bf63',
            borderRadius: '50px',
            padding: '4px 14px',
            fontSize: '0.75rem',
            fontWeight: '600'
          }}
        >
          {partido.hora?.slice(0, 5) || 'VS'}
        </span>

        {partido.marcador1 !== null && (
          <div className="font-weight-bold h5 mb-0">
            {partido.marcador1} : {partido.marcador2}
          </div>
        )}
      </div>

      {/* VISITANTE */}
      <div className="d-flex align-items-center justify-content-end" style={{ width: '30%', gap: '8px', minWidth: 0 }}>
        
        {/* Logo + Nombre */}
        <div className="d-flex align-items-center" style={{ gap: '6px', minWidth: 0 }}>
          
          <span 
            className="small font-weight-bold text-truncate"
            style={{ maxWidth: '90px' }}
            title={partido.equipo_b?.nombre}
          >
            {partido.equipo_b?.nombre}
          </span>

          <img 
            src={`${Images}/${partido.equipo_b?.archivo}`} 
            width="36" 
            height="36" 
            style={{ objectFit: 'contain' }} 
            onError={e => e.target.src = ErrorLogo} 
            alt=""
          />

        </div>

        {/* Línea derecha */}
        <div 
          style={{ 
            width: '4px', 
            height: '45px', 
            background: `linear-gradient(180deg, #E0E0E0, ${partido.equipo_b?.color_hover})`,
            borderRadius: '10px'
          }}
        ></div>

      </div>

    </div>

    {/* SEDE */}
    <div className="text-center mt-2 pt-2 border-top">
      <small 
        className="text-muted" 
        style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}
      >
        🏟️ {partido.sede || 'Cancha por definir'}
      </small>
    </div>

  </div>
</div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-5 bg-light rounded" style={{ border: '2px dashed #ddd' }}>
          <p className="mb-0 text-muted">No hay partidos para esta fecha seleccionada.</p>
          <button className="btn btn-link btn-sm text-success" onClick={seleccionarFechaMasCercana}>
            Ver fecha más cercana
          </button>
        </div>
      )}
    </div>
  </div>
)}


{/* Si eligió jornadas, mostramos la lista de botones de jornada */}
{vista === 'por_jornada' && (
  <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
    {listaJornadas
      .sort((a, b) => {
        // Extraemos solo los números del texto para comparar (ej: "Fecha 12" -> 12)
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB; // Cambia a numB - numA si los quieres de mayor a menor
      })
      .map(j => (
        <button 
          key={j} 
          className={`btn-jornada ${jornadaSeleccionada === j ? 'active' : ''}`}
          onClick={() => setJornadaSeleccionada(jornadaSeleccionada === j ? null : j)}
        >
          {j}
        </button>
      ))}
  </div>
)}

{vista !== 'diario' && (
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
                    {partidosAMostrar.map((partido) => (
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
          {/* Solo muestra el paginador si la vista es 'todos' */}
{vista === 'todos' && (
  <div className="pagination mt-4">
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
)}
          </div>
          )}

          {/* Cards de partidos */}
          <section className="Partidos hiden-box">
            <div className="margen mt-4">
              <div className="row">
                {partidosAMostrar.map((partido) => (
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
                                 <span className="badge badge-success px-3 mb-1" style={{backgroundColor: '#00bf63'}}>
                        {partido.hora?.slice(0, 5) || 'VS'}
                      </span>
                                 <span className="fecha" style={{ fontSize: '0.75rem', color: '#666' }}>
          {partido.fecha}
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
           {/* Solo muestra el paginador si la vista es 'todos' */}
{vista === 'todos' && (
  <div className="pagination mt-4">
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
)}
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
                    <h1 className="scoremodal"> {selectedPartido.jornada || " "}</h1>
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
                <span className="badge badge-dark mr-2" style={{ fontSize: '0.7rem',  marginLeft: '14px' }}>
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
