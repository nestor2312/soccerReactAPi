import { useEffect, useState, useMemo, useRef } from "react";
import Footer from "../components/Footer/Footer";
import Menu from "../components/Menu/Menu";
import axios from "axios";
import "./../App.css";
import Cargando from "../components/Carga/carga";
import ErrorLogo from "../assets/Vector.svg";
import { API_ENDPOINT, IMAGES_URL } from "../ConfigAPI";
import ErrorCarga from "../components/Error/Error";
import { Link, useParams } from "react-router-dom";
const endpoint = `${API_ENDPOINT}`;

const Images = IMAGES_URL;

const Inicio = () => {
  const [eliminatoriasOctavos, setEliminatoriasOctavos] = useState([]);
  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);
 const [instanciaVista, setInstanciaVista] = useState('ida');
  const [eliminatoriastercerPuesto, setEliminatoriastercerPuesto ] = useState(
    [],
  );

// modal inicio
  const [selectedPartido, setSelectedPartido] = useState(null);
   const modalRef = useRef(null);
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
// modal fin


 
const [vista, setVista] = useState('llaves');

  const { subcategoriaId } = useParams();
  const [Teams, setTeams] = useState([]);
  const [Matches, setMatches] = useState([]);
  const [clasificacion, setclasificacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const fasesData = useMemo(() => {
     // Juntamos todos los partidos de los estados
     const todas = [
       ...eliminatoriasOctavos,
       ...eliminatoriasCuartos,
       ...eliminatoriasSemis,
       ...eliminatoriasFinal,
       ...eliminatoriastercerPuesto,
     ];
     const fases = {};
 
     todas.forEach((partido) => {
       // Es vital que el backend envíe 'nombre_fase'
       const nombre = partido.nombre_fase || "General";
 
       if (!fases[nombre]) {
         fases[nombre] = {
           octavos: [],
           cuartos: [],
           semis: [],
           final: [],
           tercerPuesto: [],
         };
       }
 
       const num = parseInt(partido.numPartido, 10);
       if (num === 1) fases[nombre].octavos.push(partido);
       else if (num === 2) fases[nombre].cuartos.push(partido);
       else if (num === 3) fases[nombre].semis.push(partido);
       else if (num === 4) fases[nombre].final.push(partido);
       else if (num === 5) fases[nombre].tercerPuesto.push(partido);
     });
 
     // Rellenar espacios vacíos por CADA fase individualmente
     Object.keys(fases).forEach((nombre) => {
       // Relleno para Octavos (8 partidos)
       while (
         fases[nombre].octavos.length < 8 &&
         fases[nombre].octavos.length > 0
       ) {
         fases[nombre].octavos.push({});
       }
       // Relleno para Cuartos (4 partidos)
       while (
         fases[nombre].cuartos.length < 4 &&
         fases[nombre].cuartos.length > 0
       ) {
         fases[nombre].cuartos.push({});
       }
       // Relleno para Semis (2 partidos)
       while (fases[nombre].semis.length < 2 && fases[nombre].semis.length > 0) {
         fases[nombre].semis.push({});
       }
       while (fases[nombre].final.length < 1 && fases[nombre].final.length > 0) {
         fases[nombre].final.push({});
       }
       while (
         fases[nombre].tercerPuesto.length < 1 &&
         fases[nombre].tercerPuesto.length > 0
       ) {
         fases[nombre].tercerPuesto.push({});
       }
     });
 
     console.log("Fases detectadas:", Object.keys(fases));
     return fases;
   }, [
     eliminatoriasOctavos,
     eliminatoriasCuartos,
     eliminatoriasSemis,
     eliminatoriasFinal,
     eliminatoriastercerPuesto,
   ]);


  useEffect(() => {


    const getTeamsAll = async () => {
      try {
        // const response = await axios.get(`${endpoint}/userHomeTeams`);
        const response = await axios.get(
          `${endpoint}subcategoria/${subcategoriaId}/equipos`,
        );

        const filteredteams = response.data.slice(0, 9);
        setTeams(filteredteams);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Error al cargar los partidos");
        console.error("Error  teams:", error);
      }
    };
    const getMatchesAll = async () => {
      try {
        // const response = await axios.get(`${endpoint}/partidos`);
        const response = await axios.get(
          `${endpoint}subcategoria/${subcategoriaId}/partidos`,
        );

        const filteredMatches = response.data.slice(0, 4);
        setMatches(filteredMatches);
      } catch (error) {
        setError("Error al cargar los partidos");
        console.error("Error  Matches:", error);
      }
    };
const getEliminatorias = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}eliminatoria/subcategoria/${subcategoriaId}`);
    const data = response.data; // Aquí están todas las copas

    // Convertimos el objeto en un array de valores y los unimos
    const todasLasFases = Object.values(data);

    // Usamos flatMap para extraer y juntar todos los partidos de cada fase
    setEliminatoriasOctavos(todasLasFases.flatMap(f => f.octavos || []));
    setEliminatoriasCuartos(todasLasFases.flatMap(f => f.cuartos || []));
    setEliminatoriasSemis(todasLasFases.flatMap(f => f.semis || []));
    setEliminatoriasFinal(todasLasFases.flatMap(f => f.final || []));
    setEliminatoriastercerPuesto(todasLasFases.flatMap(f => f.tercer_puesto || []));

  } catch (error) {
    console.error("Error al obtener eliminatorias:", error);
  }
};
  

    const getclasificacion = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}subcategoria/${subcategoriaId}/Inicioclasificacion`,
        );

        // Obtener el primer elemento de data
        const primerGrupo = response.data[0];

        // Obtener los primeros 4 equipos del primer grupo
        if (primerGrupo && primerGrupo.equipos) {
          primerGrupo.equipos = primerGrupo.equipos.slice(0, 4);
        }

        // Crear array que contenga solo el primer elemento modificado
        const filteredClasificacion = primerGrupo ? [primerGrupo] : [];

        setclasificacion(filteredClasificacion);
      } catch (error) {
        setError("Error al cargar los partidos");
        console.error("Error clasificacion:", error);
      }
    };

    getEliminatorias();
    getclasificacion();
    getMatchesAll();
    getTeamsAll();
  }, [subcategoriaId]);



  const formatearHora = (hora) => {
    return hora.slice(0, 5);
  };

  const abreviarNombre = (nombre) => {
    if (!nombre) return "por definir";

    // Dividir el nombre en palabras
    const palabras = nombre.split(" ");

    if (palabras.length >= 2) {
      // Primera letra de la primera palabra
      const primeraLetraPrimeraPalabra = palabras[0].charAt(0).toUpperCase();
      // Primera letra de la segunda palabra
      const primeraLetraSegundaPalabra = palabras[1].charAt(0).toUpperCase();
      // Segunda letra de la segunda palabra (si fuera necesario)
      const adicional =
        palabras[1].charAt(1).toUpperCase() ||
        palabras[0].charAt(1).toUpperCase();

      return (
        primeraLetraPrimeraPalabra +
        primeraLetraSegundaPalabra +
        adicional
      ).slice(0, 3); // Asegurar 3 caracteres
    }

    // Si solo hay una palabra, tomar los primeros 3 caracteres
    return nombre.slice(0, 3).toUpperCase();
  };

  function getTextColor(bgColor) {
    if (!bgColor) return "#000000"; // color por defecto
    const color = bgColor.replace("#", "");
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128 ? "#ffffff" : "#000000";
  }

  useEffect(() => {
    document.title = "Inicio";
  }, []);
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
          <section className="Subcategoria">
            <div className="margen">
              <div className="row">
                {clasificacion.map((datosGrupo) => (
                  <div className="col-sm-12 col-md-6 mt-4" key={datosGrupo.id}>
                    <div className="card border-0 shadow ">
                      <div className="card-header fondo-card TITULO border-0">
                        Clasificacion
                      </div>
                      <div className="card table-responsive border-0 table-sm">
                        <table className="table-borderless">
                          <thead>
                            <tr>
                              <th></th>
                              <th></th>

                              <th className="movil titulo2">pj</th>
                              <th className="movil titulo2">pg</th>
                              <th className="movil titulo2">pe</th>
                              <th className="movil titulo2">pp</th>
                              <th className="movil titulo2">gf</th>
                              <th className="movil titulo2 hidenb">gc</th>
                              <th className="movil titulo2">gd</th>
                              <th className="movil titulo2">pts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {datosGrupo.equipos.map((equipo) => (
                              <tr key={equipo.id}>
                                <th>
                                  <img
                                    src={`${Images}/${equipo.archivo}`}
                                    width="5%"
                                    className="logo"
                                    alt={equipo.nombre}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = ErrorLogo;
                                      e.target.classList.add(
                                        "error-logoInicio",
                                      );
                                    }}
                                  />
                                </th>

                                <th
                                  className="movil text-left team"
                                  width="25%"
                                >
                                  {equipo.nombre}
                                </th>
                                <th className="movil data">{equipo.pj}</th>
                                <th className="movil data">{equipo.pg}</th>
                                <th className="movil data">{equipo.pe}</th>
                                <th className="movil data">{equipo.pp}</th>
                                <th className="movil data">{equipo.gf || 0}</th>
                                <th className="movil data hidenb">
                                  {equipo.gc || 0}
                                </th>
                                <th className="movil data">{equipo.gd || 0}</th>
                                <th className="movil data">
                                  {equipo.puntos || 0}
                                </th>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {/* {{-- <button class="botonUno btn-block" ><span><a href="matches" class="matches">ver Clasificacion</a></span></button>     --} */}
                    </div>
                  </div>
                ))}

                {Matches.length > 0 ? (
                  <div className="col-sm-12 col-md-6 mt-4">
                    <div className="card border-0 shadow">
                      <div className="card-header fondo-card TITULO border-0">
                        Partidos
                      </div>
                      <div className="card table-responsive border-0 table-sm">
                        <table className="table-borderless">
                          <thead>
                            <tr>
                              <th></th>
                              <th className="titulo2 text-left">Local</th>

                              <th></th>
                              <th className="titulo2 text-right">Visitante</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {Matches.map((partido) => (
                              <tr key={partido.id}>
                                {/* Logo equipo A */}
                                <td width="10%">
                                  <img
                                    src={`${Images}/${partido.equipo_a.archivo}`}
                                    className="logo"
                                    width="100%"
                                    alt={partido.equipo_a.nombre}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = ErrorLogo;
                                      e.target.classList.add(
                                        "error-logoInicio",
                                      );
                                    }}
                                  />
                                </td>

                                <td className="text-left team" width="30%">
                                  {partido.equipo_a.nombre}
                                </td>

                                <td className="text-center" width="20%">
                                  {partido.marcador1 == null ||
                                  partido.marcador2 == null ? (
                                    <div>
                                      <span className="fecha">
                                        {partido.fecha ? partido.fecha : "VS"}
                                      </span>
                                      <span className="hora">
                                        {partido.hora
                                          ? formatearHora(partido.hora)
                                          : ""}
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
                                  {partido.equipo_b.nombre}
                                </td>

                                <td width="10%">
                                  <img
                                    src={`${Images}/${partido.equipo_b.archivo}`}
                                    className="logo"
                                    width="100%"
                                    alt={partido.equipo_b.nombre}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = ErrorLogo;
                                      e.target.classList.add(
                                        "error-logoInicio",
                                      );
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="no-datos"></p> // Mostrar este mensaje si no hay datos
                )}

                <div className="col-12 col-sm-12 col-md-12 mt-4">
                  <div className="card border-0 shadow">
                    <div className="card-header fondo-card TITULO border-0">
                      Equipos
                    </div>
                    <div className="card-body ">
                      <div className="box-team">
                        {Teams.map((team) => {
                          const textColor = getTextColor(team.color_hover);

                          return (
                            <div key={team.id} className="mx-1 team-item">
                              <Link
                                to={`/torneo/categoria/${subcategoriaId}/equipo/${team.id}/jugadores`}
                                className="team-item2 BoxCard"
                              >
                                <div
                                  className="caja1  mt-3 d-flex flex-wrap align-content-end justify-content-center"
                                  style={{
                                    "--hover-color": team.color_hover,
                                    "--hover-text-color": textColor,
                                    transition:
                                      "background 0.4s ease, color 0.4s ease",
                                  }}
                                >
                                  <div className="fondo">
                                    <img
                                      src={`${Images}/${team.archivo}`}
                                      width="50%"
                                      className="d-block mx-auto my-2 logomovil"
                                      alt={team.nombre}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = ErrorLogo;
                                        e.target.classList.add("error-logo");
                                      }}
                                    />
                                    <h6 className="text-center team-hover ">
                                      {team.nombre}
                                    </h6>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Esquema de eliminatorias */}

                <div className="col-sm-12 col-md-12 mt-4 mb-3">
                  <div className="card mt-2 border-0 shadow">
                    <div className="card-header fondo-card TITULO border-0">
                      Eliminatorias
                    </div>

<div className="gap-1 "> 
      {/* Contenedor del Toggle */}
      <div className="flex  rounded-2xl border  shadow-inner">
        <button
          onClick={() => setVista('llaves')}
          className={`btn-flip2 flip2 mx-1 ${vista === 'llaves' ? 'active' : 'opacidad-baja'}`} 
     
      style={vista === 'llaves' ? { borderBottom: '4px solid #00bf63' } : {}}
        >
          LLAVES
        </button>
        <button
          onClick={() => setVista('lista')}
           className={`btn-flip2 flip2 mx-1 ${vista === 'lista' ? 'active' : 'opacidad-baja'}`} 
     
      style={vista === 'lista' ? { borderBottom: '4px solid #00bf63' } : {}}
        >
          LISTA
        </button>
      </div>

      {/* Renderizado Condicional */}
      <div className="w-full max-w-4xl">
        {vista === 'llaves' ? (
          <div className="animate-fade-in"> 
           
                    {Object.entries(fasesData).map(([nombreFase, rondas]) => (
                                  <div key={nombreFase} className="fase-contenedor mb-5">
                                    {/* Título de la Fase */}
                                    <h3
                                      className="text-center text-uppercase fw-bold py-3 mt-1 text-white"
                                      style={{ background: 'linear-gradient(90deg, #1b5896 0%, #1a1d23 100%)', borderLeft: '5px solid #00bf63' }}
                                    >
                                      {nombreFase}
                                    </h3>
                    
                                    <div className="titulos">
                                      {rondas.octavos.length > 0 ? (
                                        <div className="titulo">Octavos</div>
                                      ) : // Si no hay partidos registrados en cuartos, no se renderiza nada
                                      null}
                                      {rondas.cuartos.length > 0 ? (
                                        <div className="titulo">Cuartos</div>
                                      ) : // Si no hay partidos registrados en cuartos, no se renderiza nada
                                      null}
                                      {rondas.semis.length > 0 ? (
                                        <div className="titulo">Semis</div>
                                      ) : // Si no hay partidos registrados en cuartos, no se renderiza nada
                                      null}
                                      {rondas.final.length > 0 ? (
                                        <div className="titulo">Final</div>
                                      ) : // Si no hay partidos registrados en cuartos, no se renderiza nada
                                      null}
                                      {rondas.final.length > 0 ? (
                                        <div className="titulo">Campeón</div>
                                      ) : (
                                        <div className="placeholder-conector"></div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="esquema">
                                        <div className="jornada_contenedor">
                                          {/* Octanos */}
                                          {rondas.octavos.length > 0 ? (
                                            rondas.octavos.map((partido, index) => {
                                              const marcador1_ida = partido.marcador1_ida;
                                              const marcador1_vuelta = partido.marcador1_vuelta;
                                              const marcador2_ida = partido.marcador2_ida;
                                              const marcador2_vuelta = partido.marcador2_vuelta;
                    
                                              const marcador1_global = marcador1_vuelta
                                                ? marcador1_ida + marcador1_vuelta
                                                : marcador1_ida;
                                              const marcador2_global = marcador2_vuelta
                                                ? marcador2_ida + marcador2_vuelta
                                                : marcador2_ida;
                    
                                              const isLocalWinner =
                                                marcador1_global > marcador2_global ||
                                                (marcador1_global === marcador2_global &&
                                                  partido.marcador1_penales >
                                                    partido.marcador2_penales);
                    
                                              const isVisitanteWinner =
                                                marcador2_global > marcador1_global ||
                                                (marcador2_global === marcador1_global &&
                                                  partido.marcador2_penales >
                                                    partido.marcador1_penales);
                    
                                              return (
                                                <div className="partido" key={index}>
                                                  <div className="jornada">
                                                    {/* Equipo Local */}
                                                    <div
                                                      className={`jugador ${
                                                        isLocalWinner
                                                          ? "win"
                                                          : isVisitanteWinner
                                                            ? "lose"
                                                            : ""
                                                      }`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_aa?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_aa
                                                          ? abreviarNombre(partido.equipo_aa.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador1_ida} {marcador1_vuelta || " "}
                                                        {marcador1_vuelta &&
                                                          ` (${marcador1_global})`}
                                                        {partido.marcador1_penales !== undefined &&
                                                        partido.marcador1_penales !== null
                                                          ? ` (${partido.marcador1_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                    
                                                    {/* Equipo Visitante */}
                                                    <div
                                                      className={`jugador ${
                                                        isVisitanteWinner
                                                          ? "win"
                                                          : isLocalWinner
                                                            ? "lose"
                                                            : ""
                                                      }`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_b?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_b
                                                          ? abreviarNombre(partido.equipo_b.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador2_ida} {marcador2_vuelta || ""}
                                                        {marcador2_vuelta &&
                                                          ` (${marcador2_global})`}
                                                        {partido.marcador2_penales !== undefined &&
                                                        partido.marcador2_penales !== null
                                                          ? ` (${partido.marcador2_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })
                                          ) : (
                                            <div className="placeholder-fase"></div>
                                          )}
                                        </div>
                    
                                        {/* {{-- Conectores de octavos a cuartos --}} */}
                                        {rondas.octavos.length > 0 ? (
                                          <div
                                            className={`conectores ${rondas.cuartos.length > 0 ? "siguiente-registradaa" : ""}`}
                                          >
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div className="conector_doble conector_doble_octavos"></div>
                                              <div className="conector_simple"></div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="placeholder-conector"></div>
                                        )}
                    
                                        <div className="jornada_contenedor">
                                          {/* Cuartos */}
                                          {rondas.cuartos.length > 0 ? (
                                            rondas.cuartos.map((partido, index) => {
                                              const marcador1_ida = partido.marcador1_ida;
                                              const marcador1_vuelta = partido.marcador1_vuelta;
                                              const marcador2_ida = partido.marcador2_ida;
                                              const marcador2_vuelta = partido.marcador2_vuelta;
                    
                                              const marcador1_global = marcador1_vuelta
                                                ? marcador1_ida + marcador1_vuelta
                                                : marcador1_ida;
                                              const marcador2_global = marcador2_vuelta
                                                ? marcador2_ida + marcador2_vuelta
                                                : marcador2_ida;
                    
                                              const isLocalWinner =
                                                marcador1_global > marcador2_global ||
                                                (marcador1_global === marcador2_global &&
                                                  partido.marcador1_penales >
                                                    partido.marcador2_penales);
                    
                                              const isVisitanteWinner =
                                                marcador2_global > marcador1_global ||
                                                (marcador2_global === marcador1_global &&
                                                  partido.marcador2_penales >
                                                    partido.marcador1_penales);
                    
                                              return (
                                                <div className="partido" key={index}>
                                                  {/* <div className="jornada"> */}
                                                  <div
                                                    className={`jornada ${eliminatoriasOctavos.length > 0 ? "jornada2" : ""}`}
                                                  >
                                                    {/* Equipo Local */}
                                                    <div
                                                      className={`jugador ${
                                                        isLocalWinner
                                                          ? "win"
                                                          : isVisitanteWinner
                                                            ? "lose"
                                                            : ""
                                                      }`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_aa?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_aa
                                                          ? abreviarNombre(partido.equipo_aa.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador1_ida} {marcador1_vuelta || " "}
                                                        {marcador1_vuelta &&
                                                          ` (${marcador1_global})`}
                                                        {partido.marcador1_penales !== undefined &&
                                                        partido.marcador1_penales !== null
                                                          ? ` (${partido.marcador1_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                    
                                                    {/* Equipo Visitante */}
                                                    <div
                                                      className={`jugador ${
                                                        isVisitanteWinner
                                                          ? "win"
                                                          : isLocalWinner
                                                            ? "lose"
                                                            : ""
                                                      }`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_b?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_b
                                                          ? abreviarNombre(partido.equipo_b.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador2_ida} {marcador2_vuelta || ""}
                                                        {marcador2_vuelta &&
                                                          ` (${marcador2_global})`}
                                                        {partido.marcador2_penales !== undefined &&
                                                        partido.marcador2_penales !== null
                                                          ? ` (${partido.marcador2_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            })
                                          ) : (
                                            <div className="placeholder-fase"></div>
                                          )}
                                        </div>
                    
                                        {/* {{-- Conectores de cuartos a semis --}} */}
                                        {rondas.cuartos.length > 0 ? (
                                          <div
                                            className={`conectores ${rondas.semis.length > 0 ? "siguiente-registradaa" : ""}`}
                                          >
                                            <div className="conector">
                                              <div
                                                className={`conector_doble conector_doble_cuartos ${rondas.octavos.length > 0 ? "conector_doble_cuartos_octavos" : ""}`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div
                                                className={`conector_doble conector_doble_cuartos ${rondas.octavos.length > 0 ? "conector_doble_cuartos_octavos" : ""}`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                                            <div className="conector">
                                              <div
                                                className={`conector_doble conector_doble_cuartos ${rondas.octavos.length > 0 ? "conector_doble_cuartos_octavos" : ""}`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div
                                                className={`conector_doble conector_doble_cuartos ${rondas.octavos.length > 0 ? "conector_doble_cuartos_octavos" : ""}`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="placeholder-conector"></div>
                                        )}
                    
                                        {/* {{--semis --}} */}
                                        <div className="jornada_contenedor">
                                          {rondas.semis.length > 0 ? (
                                            rondas.semis.map((partido, index) => {
                                              const marcador1_ida = partido.marcador1_ida;
                                              const marcador1_vuelta = partido.marcador1_vuelta;
                                              const marcador2_ida = partido.marcador2_ida;
                                              const marcador2_vuelta = partido.marcador2_vuelta;
                    
                                              // Calcular los marcadores globales si hay marcador de vuelta
                                              const marcador1_global = marcador1_vuelta
                                                ? marcador1_ida + marcador1_vuelta
                                                : marcador1_ida;
                                              const marcador2_global = marcador2_vuelta
                                                ? marcador2_ida + marcador2_vuelta
                                                : marcador2_ida;
                    
                                              // Condiciones para determinar el ganador
                                              const isLocalWinner =
                                                marcador1_global > marcador2_global ||
                                                (marcador1_global === marcador2_global &&
                                                  partido.marcador1_penales >
                                                    partido.marcador2_penales);
                                              const isVisitanteWinner =
                                                marcador2_global > marcador1_global ||
                                                (marcador2_global === marcador1_global &&
                                                  partido.marcador2_penales >
                                                    partido.marcador1_penales);
                    
                                              return (
                                                <>
                                                  <div className="jornada" key={`local-${index}`}>
                                                    <div
                                                      className={`jugador ${isLocalWinner ? "win" : isVisitanteWinner ? "lose" : ""}`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_aa?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_aa
                                                          ? abreviarNombre(partido.equipo_aa.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador1_ida} {marcador1_vuelta || ""}
                                                        {/* Goles Globales solo si hay marcador de vuelta */}
                                                        {marcador1_vuelta &&
                                                          ` (${marcador1_global})`}
                                                        {/* Penales solo si están definidos */}
                                                        {partido.marcador1_penales !== undefined &&
                                                        partido.marcador1_penales !== null
                                                          ? `  (${partido.marcador1_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  </div>
                    
                                                  <div
                                                    className="jornada"
                                                    key={`visitante-${index}`}
                                                  >
                                                    <div
                                                      className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_b?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_b
                                                          ? abreviarNombre(partido.equipo_b.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador2_ida} {marcador2_vuelta || " "}
                                                        {/* Goles Globales solo si hay marcador de vuelta */}
                                                        {marcador2_vuelta &&
                                                          ` (${marcador2_global})`}
                                                        {/* Penales solo si están definidos */}
                                                        {partido.marcador2_penales !== undefined &&
                                                        partido.marcador2_penales !== null
                                                          ? `  (${partido.marcador2_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </>
                                              );
                                            })
                                          ) : (
                                            <div className="placeholder-fase-semis"></div>
                                          )}
                                        </div>
                    
                                        {/* {{-- Conectores de semis a final --}} */}
                                        {rondas.semis.length > 0 ? (
                                          <div
                                            className={`conectores ${
                                              rondas.final.length > 0
                                                ? "siguiente-registradaa"
                                                : rondas.octavos.length > 0
                                                  ? "siguiente-registrada"
                                                  : ""
                                            }`}
                                          >
                                            <div className="conector">
                                              {/* <div className="conector_doble conector_doble_semifinal"></div> */}
                                              <div
                                                className={`conector_doble ${
                                                  rondas.octavos.length > 0
                                                    ? "conector_doble_semifinal_octavos "
                                                    : "conector_doble_semifinal "
                                                }`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                    
                                            <div className="conector">
                                              <div
                                                className={`conector_doble ${
                                                  rondas.octavos.length > 0
                                                    ? "conector_doble_semifinal_octavos "
                                                    : "conector_doble_semifinal "
                                                }`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="placeholder-conector"></div>
                                        )}
                    
                                        {/* {{-- final --}}     */}
                                        <div className="jornada_contenedor">
                                          {rondas.final.length > 0 ? (
                                            rondas.final.map((partido, index) => {
                                              const marcador1_ida = partido.marcador1_ida;
                                              const marcador1_vuelta = partido.marcador1_vuelta;
                                              const marcador2_ida = partido.marcador2_ida;
                                              const marcador2_vuelta = partido.marcador2_vuelta;
                    
                                              // Calcular los marcadores globales si hay marcador de vuelta
                                              const marcador1_global = marcador1_vuelta
                                                ? marcador1_ida + marcador1_vuelta
                                                : marcador1_ida;
                                              const marcador2_global = marcador2_vuelta
                                                ? marcador2_ida + marcador2_vuelta
                                                : marcador2_ida;
                    
                                              // Condiciones para determinar el ganador
                                              const isLocalWinner =
                                                marcador1_global > marcador2_global ||
                                                (marcador1_global === marcador2_global &&
                                                  partido.marcador1_penales >
                                                    partido.marcador2_penales);
                                              const isVisitanteWinner =
                                                marcador2_global > marcador1_global ||
                                                (marcador2_global === marcador1_global &&
                                                  partido.marcador2_penales >
                                                    partido.marcador1_penales);
                    
                                              return (
                                                <>
                                                  <div className="jornada" key={`local-${index}`}>
                                                    <div className="conector_doble"></div>
                                                    <div className="conector_simple"></div>
                                                    <div
                                                      className={`jugador ${isLocalWinner ? "win" : isVisitanteWinner ? "lose" : ""}`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_aa?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_aa
                                                          ? abreviarNombre(partido.equipo_aa.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador1_ida} {marcador1_vuelta || " "}
                                                        {/* Goles Globales solo si hay marcador de vuelta */}
                                                        {marcador1_vuelta &&
                                                          ` (${marcador1_global})`}
                                                        {/* Penales solo si están definidos */}
                                                        {partido.marcador1_penales !== undefined &&
                                                        partido.marcador1_penales !== null
                                                          ? `  (${partido.marcador1_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  </div>
                    
                                                  <div
                                                    className="jornada"
                                                    key={`visitante-${index}`}
                                                  >
                                                    <div className="conector_doble"></div>
                                                    <div className="conector_simple"></div>
                                                    <div
                                                      className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
                                                    >
                                                      <img
                                                        src={`${Images}/${partido.equipo_b?.archivo}`}
                                                        alt=""
                                                        className="logo"
                                                        onError={(e) => {
                                                          e.target.onerror = null;
                                                          e.target.src = ErrorLogo;
                                                          e.target.classList.add("error-logoElim");
                                                        }}
                                                      />
                                                      <span className="equipo">
                                                        {partido.equipo_b
                                                          ? abreviarNombre(partido.equipo_b.nombre)
                                                          : "Por Definir"}
                                                      </span>
                                                      <span className="goles">
                                                        {marcador2_ida} {marcador2_vuelta || " "}
                                                        {/* Goles Globales solo si hay marcador de vuelta */}
                                                        {marcador2_vuelta &&
                                                          ` (${marcador2_global})`}
                                                        {/* Penales solo si están definidos */}
                                                        {partido.marcador2_penales !== undefined &&
                                                        partido.marcador2_penales !== null
                                                          ? `  (${partido.marcador2_penales})`
                                                          : ""}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </>
                                              );
                                            })
                                          ) : (
                                            <div className="placeholder-fase-semis"></div>
                                          )}
                                        </div>
                    
                                        {/* {{-- Conectores de final a campeon --}} */}
                                        {rondas.final.length > 0 ? (
                                          <div
                                            className={`conectores ${
                                              rondas.octavos.length > 0
                                                ? "siguiente-registradaa"
                                                : "siguiente-registrada"
                                            }`}
                                          >
                                            <div className="conector">
                                              <div
                                                className={`conector_doble ${
                                                  rondas.octavos.length > 0
                                                    ? "conector_doble_final_octavos"
                                                    : "conector_doble_final"
                                                }`}
                                              ></div>
                                              <div className="conector_simple"></div>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="placeholder-conector"></div>
                                        )}
                    
                                        {/* Ganador */}
                                        <div className="ganador_esquema">
                                          {rondas.final.length > 0 ? (
                                            <div className="ganador">
                                              <div className="conector_doble"></div>
                                              <div className="conector_simple"></div>
                    
                                              {/* Verificar si ambos marcadores de ida y vuelta están presentes */}
                                              {rondas.final[0] &&
                                              rondas.final[0].marcador1_ida !== null &&
                                              rondas.final[0].marcador2_ida !== null ? (
                                                (() => {
                                                  // Calcular el marcador global solo si hay marcador de vuelta
                                                  const marcador1_global =
                                                    rondas.final[0].marcador1_vuelta !== null
                                                      ? rondas.final[0].marcador1_ida +
                                                        rondas.final[0].marcador1_vuelta
                                                      : rondas.final[0].marcador1_ida;
                                                  const marcador2_global =
                                                    rondas.final[0].marcador2_vuelta !== null
                                                      ? rondas.final[0].marcador2_ida +
                                                        rondas.final[0].marcador2_vuelta
                                                      : rondas.final[0].marcador2_ida;
                    
                                                  // Determinar el equipo ganador considerando marcador global y penales
                                                  const isLocalWinner =
                                                    marcador1_global > marcador2_global ||
                                                    (marcador1_global === marcador2_global &&
                                                      rondas.final[0].marcador1_penales >
                                                        rondas.final[0].marcador2_penales);
                                                  const isVisitanteWinner =
                                                    marcador2_global > marcador1_global ||
                                                    (marcador2_global === marcador1_global &&
                                                      rondas.final[0].marcador2_penales >
                                                        rondas.final[0].marcador1_penales);
                    
                                                  // Asignar el equipo ganador
                                                  const equipoGanador = isLocalWinner
                                                    ? rondas.final[0].equipo_aa
                                                    : isVisitanteWinner
                                                      ? rondas.final[0].equipo_b
                                                      : null;
                    
                                                  return equipoGanador ? (
                                                    <div className="jugador win">
                                                      <img
                                                        src={`${Images}/${equipoGanador.archivo}`}
                                                        className="logo"
                                                        alt={equipoGanador.nombre}
                                                      />
                                                      <span className="equipo">
                                                        {equipoGanador.nombre}
                                                      </span>
                                                    </div>
                                                  ) : (
                                                    <div className="jugador">
                                                      <span className="equipo">
                                                        Por Definir ganador
                                                      </span>
                                                    </div>
                                                  );
                                                })()
                                              ) : (
                                                <div className="jugador">
                                                  <span className="equipo">
                                                    Por Definir ganador
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="placeholder-conector"></div>
                                          )}
                                        </div>
                                      </div>
                    
                                      <div className="d-flex justify-content-center">
 {rondas?.tercer_puesto?.map((partido, index) => {
    // 1. Cálculos de lógica antes del return
    const m1_ida = partido.marcador1_ida || 0;
    const m1_vuelta = partido.marcador1_vuelta;
    const m2_ida = partido.marcador2_ida || 0;
    const m2_vuelta = partido.marcador2_vuelta;

    const global1 = m1_vuelta !== null ? m1_ida + m1_vuelta : m1_ida;
    const global2 = m2_vuelta !== null ? m2_ida + m2_vuelta : m2_ida;

    // 2. Retorno del JSX
    return (
      <div key={partido.id || index} className="partido-card">
        {/* Equipo Local */}
        <div className="jugador mt-2">
          <span className="equipo">
            {partido.equipo_aa?.nombre || "Por Definir"}
          </span>
          <span className="goles">
            {m1_ida} {m1_vuelta !== null ? `- ${m1_vuelta}` : ""}
            {m1_vuelta !== null && ` (${global1})`}
            {partido.marcador1_penales && ` (${partido.marcador1_penales})`}
          </span>
        </div>

        <strong className="text-center d-block mt-1"> VS </strong>

        {/* Equipo Visitante */}
        <div className="jugador mt-1">
          <span className="equipo">
            {partido.equipo_b?.nombre || "Por Definir"}
          </span>
          <span className="goles">
            {m2_ida} {m2_vuelta !== null ? `- ${m2_vuelta}` : ""}
            {m2_vuelta !== null && ` (${global2})`}
            {partido.marcador2_penales && ` (${partido.marcador2_penales})`}
          </span>
        </div>
      </div>
    );
  })}



                  </div>
                                      


                                    </div>
                                  </div>
                                ))}

          </div>
        ) : (
         <div className="animate-fade-in px-2">
  {Object.entries(fasesData).map(([nombreFase, rondas]) => (
    <div key={nombreFase} className="mb-5">
      {/* Título Principal de la Fase (Copa Oro, etc.) */}
     <div className="mb-4 p-3 rounded-3 d-flex align-items-center justify-content-between" 
           style={{ background: 'linear-gradient(90deg, #1b5896 0%, #1a1d23 100%)', borderLeft: '5px solid #00bf63' }}>
        <h3 className="text-white text-uppercase fw-bold fw-black m-0" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
          {nombreFase}
        </h3>
      </div>

      {/* Definimos las rondas en orden para iterarlas fácil */}
      {[
        { id: 'octavos', titulo: 'Octavos de Final' },
        { id: 'cuartos', titulo: 'Cuartos de Final' },
        { id: 'semis', titulo: 'Semifinales' },
        { id: 'final', titulo: 'Gran Final' }
      ].map((ronda) => (
        // Solo mostramos la sección si la ronda tiene partidos
        rondas[ronda.id] && rondas[ronda.id].length > 0 && (
          <div key={ronda.id} className="mb-4">
            {/* Título de la Ronda (Octavos, Cuartos...) */}
           <div className="d-flex align-items-center  mb-3">
              <div style={{ width: '4px', height: '20px', background: '#00bf63cc', marginRight: '10px', borderRadius:'10px' }}></div>
              <h4 className="text-uppercase fw-bold m-0  " style={{ fontSize: '0.9rem', color: '#000000' }}>
                {ronda.titulo}
              </h4>
            </div>

         <div className="row g-3">
  {rondas[ronda.id].map((partido, idx) => (
    <div key={idx} className="col-12 col-md-12"
      onClick={() => handleOpenModal(partido)}>
<div className="p-3 shadow-sm border-0" 
     style={{ 
       background: 'linear-gradient(135deg, #00bf63cc 0%, #09537ecc 100%)', 
       borderRadius: '12px' 
     }}>        
        <div className="d-flex align-items-center justify-content-between">
          
          {/* EQUIPO A (Logo a la izquierda) */}
          <div className="d-flex align-items-center gap-2 flex-1">
            <img
              src={`${Images}/${partido.equipo_aa?.archivo}`}
              width="45px"
              height="45px"
              style={{ objectFit: 'contain' }}
              alt=""
              onError={(e) => { e.target.src = ErrorLogo; }}
            />
            <span className="text-white fw-bold small text-uppercase">
              {partido.equipo_aa?.nombre?.substring(0, 50) || 'Por definir'}
            </span>
          </div>

          {/* MARCADORES CENTRALES O VS */}
<div className="d-flex align-items-center justify-content-center mx-2" style={{ minWidth: '60px' }}>
  {partido.marcador1_ida === null || partido.marcador1_ida === undefined ? (
    /* Si no hay marcador, mostramos el VS */
    <span 
  className="badge rounded-pill px-3 py-2 glass" 
>
  VS
</span>
  ) : (
    /* Si hay marcador, mostramos los números */
   /* Si ya hay goles, mostramos la suma (Global) */
    <div className="d-flex align-items-center px-2 glass rounded-2" style={{ border: '1px solid rgba(255,255,255,0.4)' }}>
      <span className="text-white fs-5 fw-black px-2">
        {(partido.marcador1_ida || 0) + (partido.marcador1_vuelta || 0)}
      </span>
      <span className="text-white opacity-50">-</span>
      <span className="text-white fs-5 fw-black px-2">
        {(partido.marcador2_ida || 0) + (partido.marcador2_vuelta || 0)}
      </span>
    </div>
  )}
</div>

          {/* EQUIPO B (Logo a la derecha) */}
          <div className="d-flex align-items-center justify-content-end gap-2 flex-1 text-end">
            <span className="text-white fw-bold small text-uppercase">
              {partido.equipo_b?.nombre?.substring(0, 50) || 'Por definir'}
            </span>
            <img
              src={`${Images}/${partido.equipo_b?.archivo}`}
              width="45px"
              height="45px"
              style={{ objectFit: 'contain' }}
              alt=""
              onError={(e) => { e.target.src = ErrorLogo; }}
            />
          </div>

        </div>

     {/* CONDICIÓN MAESTRA: 
    Solo si existe marcador de vuelta O existen penales, se dibuja el contenedor de detalles.
*/}
{((partido.marcador1_vuelta !== null && partido.marcador1_vuelta !== undefined) || 
  (partido.marcador1_penales !== null && partido.marcador1_penales !== undefined)) && (
  
  <div className="mt-2 pt-2 border-top border-white border-opacity-10">
    <div className="d-flex justify-content-center gap-2">
      
      {/* Detalle de Ida y Vuelta */}
      {partido.marcador1_vuelta !== null && (
        <div className="px-2 py-1 rounded text-white" style={{ background: 'rgba(0,0,0,0.2)', fontSize: '0.65rem' }}>
          <span className="opacity-75">IDA:</span> {partido.marcador1_ida}-{partido.marcador2_ida} 
          <span className="mx-1">|</span> 
          <span className="opacity-75">VUELTA:</span> {partido.marcador1_vuelta}-{partido.marcador2_vuelta}
        </div>
      )}

      {/* Detalle de Penales */}
      {partido.marcador1_penales !== null && (
        <div className="px-2 py-1 rounded bg-danger text-white fw-bold" style={{ fontSize: '0.65rem' }}>
          PEN: {partido.marcador1_penales} - {partido.marcador2_penales}
        </div>
      )}
      
    </div>
  </div>
)}
      

      </div>
    </div>
  ))}
</div>
          </div>
        )
      ))}
    </div>
  ))}
</div>
        )}
      </div>
    </div>
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
                        src={`${Images}/${selectedPartido.equipo_aa?.archivo}`}
                        className="logo2 TeamLocal"
                        alt={selectedPartido.equipo_aa?.nombre || "Equipo "}
                         onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                      />
                      <span className="team">
                        {selectedPartido.equipo_aa?.nombre || "Equipo "}
                      </span>
                    </div>
                  <div className="col-sm-4 col-4 d-flex flex-wrap align-content-around justify-content-center text-center">
  <span className="scoremodal">
    {instanciaVista === 'ida' && (selectedPartido.marcador1_ida ?? 0) + " - " + (selectedPartido.marcador2_ida ?? 0)}
    {instanciaVista === 'vuelta' && (selectedPartido.marcador1_vuelta ?? 0) + " - " + (selectedPartido.marcador2_vuelta ?? 0)}
{instanciaVista === 'tanda_penales' && (
    <div className="d-flex align-items-center justify-content-center">
      <span className=" mr-2 text-black" style={{ fontSize: '0.8rem' }}>P</span>
      <span>( </span> {(selectedPartido.marcador1_penales ?? 0)} - {(selectedPartido.marcador2_penales ?? 0)} <span> )</span>
    </div>
  )}  </span>

  
</div>
                    <div className="col-sm-4 col-4 d-flex justify-content-end align-items-center">
                      <span className="team">
                        {selectedPartido.equipo_b?.nombre || "Equipo B"}
                      </span>
                      <img
                        src={`${Images}/${selectedPartido.equipo_b?.archivo}`}
                        className="logo2 TeamVisitante"
                        alt={selectedPartido.equipo_b?.nombre || "Equipo "}
                         onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = ErrorLogo;
                              e.target.classList.add("error-logo");
                            }}
                      />
                    </div>
                  </div>
                  {/* El Global solo se muestra si estamos viendo la vuelta o si ya hay marcador de vuelta */}
  {(instanciaVista === 'vuelta' || selectedPartido.marcador1_vuelta !== null) && (
    <div className="d-flex small mt-1">
      <strong>Global:</strong> {(selectedPartido.marcador1_ida || 0) + (selectedPartido.marcador1_vuelta || 0)} - {(selectedPartido.marcador2_ida || 0) + (selectedPartido.marcador2_vuelta || 0)}
    </div>
  )}
                  <div className="text-center">
                    <h1 className="fecha">{selectedPartido.fecha || 'Fecha por definir' }</h1>
                    <h4 className="hora">
                      {selectedPartido.hora?.slice(0, 5)}
                    </h4>
                     <h1 className="fecha">{selectedPartido.sede || ' ' }</h1>
                  </div>
                </div>

<div className="d-flex align-items-center justify-content-center gap-2 mb-4">
  {/* Botones de Ida y Vuelta */}
  {['ida', 'vuelta'].map((inst) => (
    <button
      key={inst}
      onClick={() => setInstanciaVista(inst)}
      className="btn d-flex align-items-center p-2 border-0 shadow-none"
      style={{ 
        opacity: instanciaVista === inst ? '1' : '0.5', 
        transition: 'all 0.3s ease',
        background: 'transparent'
      }}
    >
      <div style={{ 
        width: '4px', 
        height: '16px', 
        background: '#00bf63', 
        marginRight: '8px', 
        borderRadius: '10px',
        // La barrita verde solo se muestra si está activo
        display: instanciaVista === inst ? 'block' : 'none' 
      }}></div>
      <span className="text-uppercase fw-bold" style={{ fontSize: '0.8rem', color: '#000' }}>
        {inst}
      </span>
    </button>
  ))}

  {/* Botón de Penales con Borde Dinámico */}
  {selectedPartido.marcador1_penales !== null && (
    <button 
      onClick={() => setInstanciaVista('tanda_penales')}
      className="btn rounded-3 d-flex align-items-center px-3 py-2 shadow-sm" 
      style={{ 
        background: instanciaVista === 'tanda_penales' 
          ? 'linear-gradient(90deg, #1b5896 0%, #1a1d23 100%)' 
          : '#f8f9fa',
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        // AQUÍ ESTÁ EL CAMBIO: El color del borde depende del estado activo
        borderLeft: `5px solid ${instanciaVista === 'tanda_penales' ? '#00bf63' : 'transparent'}`, 
        transition: 'all 0.3s ease',
        minWidth: '110px'
      }}
    >
      <span className="text-uppercase fw-bold m-0" style={{ 
        fontSize: '0.75rem', 
        letterSpacing: '0.5px',
        color: instanciaVista === 'tanda_penales' ? '#fff' : '#6c757d' 
      }}>
        {instanciaVista === 'tanda_penales' ? "⚽ Penales" : "Penales"}
      </span>
    </button>
  )}
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
  .filter((e) => 
    e.equipo_id === (selectedPartido.equipo_aa?.id || selectedPartido.equipo_a_id) && 
    e.instancia === instanciaVista // <--- FILTRO DINÁMICO
  )
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
                    {e.tipo_evento === 'gol_penal' && '✅'}
                      {e.tipo_evento === 'fallo_penal' && '❌'}
                  
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
  .filter((e) => 
    e.equipo_id === (selectedPartido.equipo_b?.id || selectedPartido.equipo_b_id) && 
    e.instancia === instanciaVista // <--- FILTRO DINÁMICO
  )
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
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
      {!isLoading && !error && <Footer />}
    </div>
  );
};
export default Inicio;
