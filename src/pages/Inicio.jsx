import { useEffect, useState, useMemo } from "react";
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
 
  const [eliminatoriastercerPuesto, setEliminatoriastercerPuesto ] = useState(
    [],
  );
 


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
                    {Object.entries(fasesData).map(([nombreFase, rondas]) => (
                                  <div key={nombreFase} className="fase-contenedor mb-5">
                                    {/* Título de la Fase */}
                                    <h3
                                      className="text-center text-uppercase fw-bold py-3"
                                      style={{ background: "#1b58965a" }}
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
  {rondas.tercer_puesto.map((partido, index) => {
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
