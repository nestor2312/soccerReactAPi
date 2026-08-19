/* eslint-disable no-unused-vars */
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

import  PruebaElim from "./../components/Admin/pruebaElim"
const endpoint = `${API_ENDPOINT}`;

const Images = IMAGES_URL;

const Inicio = () => {


  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  

  const [eliminatoriasOctavos, setEliminatoriasOctavos] = useState([]);
  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);
 const [instanciaVista, setInstanciaVista] = useState('ida');
  const [eliminatoriastercerPuesto, setEliminatoriastercerPuesto ] = useState(
    [],
  );
 const [eliminatoriasdieciseisavos, setEliminatoriasdieciseisavos] = useState(
    [],
  );







  
const agruparPorFechaYFase = (partidos) => {
  return partidos.reduce((acc, partido) => {

    const fecha = partido.fecha || "Sin fecha";

    const rondaObj = nombresPartidos[partido.numPartido];
    const ronda = rondaObj?.key || "sin_ronda";

    if (!acc[fecha]) acc[fecha] = {};
    if (!acc[fecha][ronda]) acc[fecha][ronda] = [];

    acc[fecha][ronda].push(partido);

    return acc;

  }, {});
};


const ordenarPorHora = (partidos) => {
  return partidos.sort((a, b) => {
    if (!a.hora) return 1;
    if (!b.hora) return -1;
    return a.hora.localeCompare(b.hora);
  });
};



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

const nombresPartidos = {
  1: { key: "octavos", label: "Octavos de Final" },
  2: { key: "cuartos", label: "Cuartos de Final" },
  3: { key: "semis", label: "Semifinales" },
  4: { key: "final", label: "Gran Final" },
  5: { key: "tercer_puesto", label: "Tercer puesto" },
  6: { key: "dieciseisavos", label: "Dieciseisavos de Final" }
};


  const fasesData = useMemo(() => {
     // Juntamos todos los partidos de los estados
     const todas = [
       ...eliminatoriasOctavos,
       ...eliminatoriasCuartos,
       ...eliminatoriasSemis,
       ...eliminatoriasFinal,
       ...eliminatoriastercerPuesto,
        ...eliminatoriasdieciseisavos,
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
           tercer_puesto: [],
            dieciseisavos: [],
         };
       }
 
       const num = parseInt(partido.numPartido, 10);
       if (num === 1) fases[nombre].octavos.push(partido);
       else if (num === 2) fases[nombre].cuartos.push(partido);
       else if (num === 3) fases[nombre].semis.push(partido);
       else if (num === 4) fases[nombre].final.push(partido);
       else if (num === 5) fases[nombre].tercer_puesto.push(partido);
         else if (num === 6) fases[nombre].dieciseisavos.push(partido);
     });
 
     // Rellenar espacios vacíos por CADA fase individualmente
     Object.keys(fases).forEach((nombre) => {

       while (
        fases[nombre].dieciseisavos.length < 16 &&
        fases[nombre].dieciseisavos.length > 0
      ) {
        fases[nombre].dieciseisavos.push({});
      }
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
         fases[nombre].tercer_puesto.length < 1 &&
         fases[nombre].tercer_puesto.length > 0
       ) {
         fases[nombre].tercer_puesto.push({});
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
       eliminatoriasdieciseisavos,
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
      setEliminatoriasdieciseisavos(todasLasFases.flatMap(f => f.dieciseisavos || []));

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

const scrollRef = useRef(null);

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

  const todosLosPartidos = useMemo(() => {
  return [
    ...eliminatoriasdieciseisavos,
    ...eliminatoriasOctavos,
    ...eliminatoriasCuartos,
    ...eliminatoriasSemis,
    ...eliminatoriasFinal,
    ...eliminatoriastercerPuesto,
  ].filter(p => p && p.id); // evitar vacíos
}, [
  eliminatoriasdieciseisavos,
  eliminatoriasOctavos,
  eliminatoriasCuartos,
  eliminatoriasSemis,
  eliminatoriasFinal,
  eliminatoriastercerPuesto,
]);

const calendario = useMemo(() => {
    return agruparPorFechaYFase(todosLosPartidos);
  }, [todosLosPartidos]);

    
// 3. LA VARIABLE CRUCIAL QUE TE FALTABA DECLARAR ARRIBA
const partidosDelDia = useMemo(() => {
  return (fechaSeleccionada && calendario[fechaSeleccionada]) || {};
}, [calendario, fechaSeleccionada]);


useEffect(() => {
  // 1. Pasamos las llaves a un array ordenado
  const fechasDisponibles = Object.keys(calendario).sort();
  
  // CRUCIAL: Solo entramos aquí si hay datos Y si el usuario NO ha seleccionado ninguna fecha aún (al cargar)
  if (fechasDisponibles.length > 0 && fechaSeleccionada === null) {
    
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    const hoyFormato = `${año}-${mes}-${dia}`; // "YYYY-MM-DD"

    if (calendario[hoyFormato]) {
      setFechaSeleccionada(hoyFormato);
    } else {
      // Filtramos "Sin fecha" para no mostrar un día inválido por defecto
      const primeraFechaValida = fechasDisponibles.find(f => f !== "Sin fecha") || fechasDisponibles[0];
      setFechaSeleccionada(primeraFechaValida);
    }
  }
}, [calendario, fechaSeleccionada]); 
// Al verificar estrictamente === null, evitamos que cualquier actualización limpie la selección del usuario

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
                    <div className="card  shadow ">
                      <div className="card-header fondo-card TITULO ">
                        Clasificacion
                      </div>
                      <div className="card table-responsive border-0 table-sm">
                        <table className="table-borderless ">
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
                    <div className="card   shadow">
                      <div className="card-header fondo-card TITULO  ">
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
                  <div className="card   shadow">
                    <div className="card-header fondo-card TITULO  ">
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
                  <div className="card mt-2   shadow">
                    <div className="card-header fondo-card TITULO  ">
                      Eliminatorias
                    </div>

<div className="gap-1 "> 
      {/* Contenedor del Toggle */}
      <div className="flex  rounded-2xl   mt-2 shadow-inner">
        <button
          onClick={() => setVista('llaves')}
          className={`btn-flip2 flip2 mx-1 ${vista === 'llaves' ? 'active' : 'opacidad-baja'}`} 
     
style={vista === 'llaves' 
  ? { borderBottom: '4px solid var(--accent-color)' } 
  : {}
}        >
          LLAVES
        </button>
        <button
          onClick={() => setVista('lista')}
           className={`btn-flip2 flip2 mx-1 ${vista === 'lista' ? 'active' : 'opacidad-baja'}`} 
     
      style={vista === 'lista' ? { borderBottom: '4px solid var(--accent-color)' } : {}}
        >
          LISTA
        </button>

        <button
  onClick={() => setVista('calendario')}
  
  className={`btn-flip2 flip2 mx-1 ${vista === 'calendario' ? 'active' : 'opacidad-baja'}`} 
  style={vista === 'calendario' ? {  borderBottom: '4px solid var(--accent-color)' } : {}}
>
  CALENDARIO
</button>
      </div>

      {/* Renderizado Condicional */}
      <div className="w-full max-w-4xl">

  {vista === 'llaves' ? (

    // ========================
    // 🔹 LLAVES
    // ========================
    <div className="animate-fade-in scroll-container card">

      {Object.entries(fasesData).map(([nombreFase, rondas]) => (
        <div key={nombreFase} className="fase-contenedor mb-5">

          <h3
            className="text-center text-uppercase fw-bold py-3 mt-1 text-white"
            style={{
              background: 'linear-gradient(90deg, #1b5896 0%, #1a1d23 100%)',
              borderLeft: '5px solid #00bf63'
            }}
          >
            {nombreFase}
          </h3>

          <PruebaElim
            rondas={rondas}
            Images={Images}
            ErrorLogo={ErrorLogo}
            abreviarNombre={abreviarNombre}
          />

        </div>
      ))}

    </div>

  ) : vista === 'lista' ? (

    // ========================
    // 🔹 LISTA (tu código actual)
    // ========================
   <div className="animate-fade-in px-2">

  {Object.entries(fasesData).map(([nombreFase, rondas]) => (
    <div key={nombreFase} className="mb-5">

      {/* HEADER FASE */}
   <div className="mb-4 p-3 mt-2 rounded-3 d-flex align-items-center justify-content-between" 
           style={{ background: 'linear-gradient(90deg, #1b5896 0%, #1a1d23 100%)', borderLeft: '5px solid #00bf63' }}>
        <h3 className="text-white text-uppercase fw-bold fw-black m-0" style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>
          {nombreFase}
        </h3>
      </div>

      {[
        { id: 'dieciseisavos', titulo: 'Dieciseisavos de Final' },
        { id: 'octavos', titulo: 'Octavos de Final' },
        { id: 'cuartos', titulo: 'Cuartos de Final' },
        { id: 'semis', titulo: 'Semifinales' },
        { id: 'tercer_puesto', titulo: 'Tercer puesto' },
        { id: 'final', titulo: 'Gran Final' }
      ].map((ronda) => (

        rondas[ronda.id] && rondas[ronda.id].length > 0 && (
          <div key={ronda.id} className="mb-4">

            {/* TITULO RONDA */}
            <div className="d-flex align-items-center mb-3">
              <div style={{
                width: '4px',
                height: '20px',
                background: '#00bf63cc',
                marginRight: '10px',
                borderRadius: '10px'
              }}></div>

              <h4 className="text-uppercase fw-bold m-0 color  " style={{ fontSize: '0.9rem' }}>
                {ronda.titulo}
              </h4>
            </div>

            {/* PARTIDOS */}
            <div className="row g-3">
              {rondas[ronda.id].map((partido) => {

                const totalA = (partido.marcador1_ida ?? 0) + (partido.marcador1_vuelta ?? 0);
                const totalB = (partido.marcador2_ida ?? 0) + (partido.marcador2_vuelta ?? 0);

                return (
                  <div key={partido.id} className="col-12" onClick={() => handleOpenModal(partido)}>

                    <div className="p-3 shadow-sm  "
                         style={{
                           background: "var(--cards-playoffs)",
                           borderRadius: '12px',
                           cursor: 'pointer'
                         }}>

                      <div className="d-flex align-items-center">

                        {/* EQUIPO A */}
                        <div className="d-flex align-items-center gap-2"
                             style={{ flex: '1 1 0', minWidth: 0 }}>
                          <img
                            src={`${Images}/${partido.equipo_aa?.archivo}`}
                            width="40px"
                            height="40px"
                            style={{ objectFit: 'contain', flexShrink: 0 }}
                            alt=""
                            onError={(e) => { e.target.src = ErrorLogo; }}
                          />
                          <span className="text-white fw-bold small text-uppercase text-truncate">
                            {partido.equipo_aa?.nombre || 'Por definir'}
                          </span>
                        </div>

                        {/* CENTRO */}
                        <div className="d-flex flex-column align-items-center justify-content-center mx-2"
                             style={{ width: '90px', flexShrink: 0 }}>

                          {/* HORA */}
                          {/* <span className="text-white small mb-1">
                            {partido.hora ? partido.hora.slice(0,5) : '--:--'}
                          </span> */}

                          {/* MARCADOR */}
                          {partido.marcador1_ida === null || partido.marcador1_ida === undefined ? (
                            <span className="badge rounded-pill px-3 py-2 glass shadow-sm"
                                  style={{ fontSize: '0.7rem' }}>
                              VS
                            </span>
                          ) : (
                            <div className="d-flex align-items-center px-2 glass rounded-2 border border-white border-opacity-25">
                              <span className="text-white fs-6 fw-bold px-1">
                                {totalA}
                              </span>
                              <span className="text-white opacity-50 small"> - </span>
                              <span className="text-white fs-6 fw-bold px-1">
                                {totalB}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* EQUIPO B */}
                        <div className="d-flex align-items-center justify-content-end gap-2 text-end"
                             style={{ flex: '1 1 0', minWidth: 0 }}>
                          <span className="text-white fw-bold small text-uppercase text-truncate">
                            {partido.equipo_b?.nombre || 'Por definir'}
                          </span>
                          <img
                            src={`${Images}/${partido.equipo_b?.archivo}`}
                            width="40px"
                            height="40px"
                            style={{ objectFit: 'contain', flexShrink: 0 }}
                            alt=""
                            onError={(e) => { e.target.src = ErrorLogo; }}
                          />
                        </div>
                      </div>

                      {/* DETALLES */}
                      {((partido.marcador1_vuelta !== null && partido.marcador1_vuelta !== undefined) ||
                        (partido.marcador1_penales !== null && partido.marcador1_penales !== undefined)) && (

                        <div className="mt-2 pt-2 border-top border-white border-opacity-10">

                          <div className="d-flex justify-content-center flex-wrap gap-2">

                            {partido.marcador1_vuelta !== null && (
                              <div className="px-2 py-1 rounded text-white"
                                   style={{ background: 'rgba(0,0,0,0.2)', fontSize: '0.65rem' }}>
                                <span className="opacity-75">I:</span> {partido.marcador1_ida}-{partido.marcador2_ida}
                                <span className="mx-1"> - </span>
                                <span className="opacity-75">V:</span> {partido.marcador1_vuelta}-{partido.marcador2_vuelta}
                              </div>
                            )}

                            {partido.marcador1_penales !== null && (
                              <div className="px-2 py-1 rounded bg-danger text-white fw-bold shadow-sm"
                                   style={{ fontSize: '0.65rem' }}>
                                PEN: {partido.marcador1_penales} - {partido.marcador2_penales}
                              </div>
                            )}

                          </div>

                        </div>
                      )}

                      {/* SEDE */}
                      <div className="text-center mt-2 small text-white opacity-75">
                        {partido.sede || "Sede por definir"}
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        )

      ))}

    </div>
  ))}

</div>

  ) : (

    // ========================
    // 🔥 CALENDARIO
    // ========================

// ========================
<div className="animate-fade-in px-2">

  {/* =========================================================================
      1. AQUÍ VAN LOS BOTONES DEL CALENDARIO (Siempre visibles arriba)
     ========================================================================= */}
  <div className="calendario-contenedor container mt-4">
    <div 
      ref={scrollRef} 
      className="d-flex overflow-auto pb-3 mb-4 gap-2 scroller-fechas" 
      style={{ whiteSpace: 'nowrap', scrollBehavior: 'smooth' }}
    >
      {Object.keys(calendario).length > 0 ? (
        Object.keys(calendario).sort().map((fecha) => {
          const esHoy = fecha === new Date().toISOString().split('T')[0];
          const fechaValida = fecha && fecha !== "null";
           
          return (
            <button
              key={fecha}
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
  </div>

  {/* =========================================================================
      2. ABAJO SE RENDERIZAN LOS PARTIDOS CORRESPONDIENTES A LA FECHA SELECCIONADA
     ========================================================================= */}
  {fechaSeleccionada && Object.keys(partidosDelDia).length > 0 ? (
    <div className="mb-4">

      {/* 🔥 ENCABEZADO DE LA FECHA SELECCIONADA */}
      <div className="mb-4 p-3 mt-2 rounded-3 d-flex align-items-center justify-content-between"
        style={{
          background: 'linear-gradient(90deg, #1b5896 0%, #1a1d23 100%)',
          borderLeft: '5px solid #00bf63'
        }}>
        <h3 className="text-white text-uppercase fw-bold m-0">
          {new Date(fechaSeleccionada + "T00:00:00").toLocaleDateString('es-CO', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </h3>
      </div>

      {/* 🔥 RONDAS Y PARTIDOS DEL DÍA */}
      {[
        { id: 'dieciseisavos', titulo: 'Dieciseisavos de Final' },
        { id: 'octavos', titulo: 'Octavos de Final' },
        { id: 'cuartos', titulo: 'Cuartos de Final' },
        { id: 'semis', titulo: 'Semifinales' },
        { id: 'tercer_puesto', titulo: 'Tercer puesto' },
        { id: 'final', titulo: 'Gran Final' }
      ].map((ronda) => {
        
        const partidos = partidosDelDia[ronda.id] || [];
        if (partidos.length === 0) return null;

        const partidosOrdenados = ordenarPorHora(partidos);

        return (
          <div key={ronda.id} className="mb-3">
            {/* TÍTULO DE LA RONDA */}
            <div className="d-flex align-items-center mb-2">
              <div style={{
                width: '4px',
                height: '18px',
                background: '#00bf63',
                marginRight: '8px',
                borderRadius: '10px'
              }}></div>
              <span className="fw-bold text-uppercase small">
                {ronda.titulo}
              </span>
            </div>

            {/* CONTENEDOR DE TARJETAS DE PARTIDOS */}
            <div className="row g-3">
              {partidosOrdenados.map((p) => {
                const totalA = (p.marcador1_ida ?? 0) + (p.marcador1_vuelta ?? 0);
                const totalB = (p.marcador2_ida ?? 0) + (p.marcador2_vuelta ?? 0);

                return (
                  <div key={p.id} className="col-12" onClick={() => handleOpenModal(p)}>
                    <div className="p-3 shadow-sm"
                      style={{
                        background: "var(--cards-playoffs)",
                        borderRadius: '12px',
                        cursor: 'pointer'
                      }}>

                      <div className="d-flex align-items-center">
                        {/* EQUIPO A */}
                        <div className="d-flex align-items-center gap-2" style={{ flex: 1 }}>
                          <img
                            src={`${Images}/${p.equipo_aa?.archivo}`}
                            width="40"
                            height="40"
                            onError={(e) => e.target.src = ErrorLogo}
                          />
                          <span className="text-white text-uppercase fw-bold small text-truncate">
                            {p.equipo_aa?.nombre || 'Por definir'}
                          </span>
                        </div>

                        {/* CENTRO */}
                        <div className="text-center mx-2" style={{ width: '80px' }}>
                          <div className="text-white small">
                            {p.hora ? p.hora.slice(0,5) : '--:--'}
                          </div>
                          {p.marcador1_ida == null ? (
                            <span className="badge rounded-pill px-3 py-2 glass">VS</span>
                          ) : (
                            <strong className="text-white">{totalA} - {totalB}</strong>
                          )}
                        </div>

                        {/* EQUIPO B */}
                        <div className="d-flex align-items-center justify-content-end gap-2 text-end" style={{ flex: 1 }}>
                          <span className="text-white text-uppercase fw-bold small text-truncate">
                            {p.equipo_b?.nombre || 'Por definir'}
                          </span>
                          <img
                            src={`${Images}/${p.equipo_b?.archivo}`}
                            width="40"
                            height="40"
                            onError={(e) => e.target.src = ErrorLogo}
                          />
                        </div>
                      </div>

                      {/* SEDE */}
                      <div className="text-center mt-2 small text-white opacity-75">
                        {p.sede || "Sede por definir"}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-center text-muted py-4">Selecciona una fecha para ver los partidos</p>
  )}
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

      <div className=" d-flex flex-column justify-content-center align-items-center">

         <div className="btn-jornada-fecha mb-4">
          {selectedPartido.numPartido && nombresPartidos[selectedPartido.numPartido]
            ? nombresPartidos[selectedPartido.numPartido].label
            : selectedPartido.numPartido
              ? `Partido ${selectedPartido.numPartido}`
              : "Partido por definir"}
        </div>

        <div className="row dialog-box"> 
          {/* COLUMNA LOCAL */}
          <div className="col-sm-4 col-4 d-flex justify-content-start align-items-center">
            {selectedPartido.equipo_aa?.archivo ? (
              <img
                src={`${Images}/${selectedPartido.equipo_aa.archivo}`}
                className="logo2 TeamLocal"
                alt={selectedPartido.equipo_aa?.nombre || "Equipo"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ErrorLogo;
                  e.target.classList.add("error-logo");
                }}
              />
            ) : (
              <img src={ErrorLogo} className="logo2 TeamLocal error-logo" alt="Sin equipo" />
            )}
            <span className="team">
              {selectedPartido.equipo_aa?.nombre || "Por definir"}
            </span>
          </div>

          {/* COLUMNA MARCADOR CENTRAL */}
          <div className="col-sm-4 col-4 d-flex flex-wrap align-content-around justify-content-center text-center">
         <span className="scoremodal" 
  style={{
    backgroundColor: "rgba(0, 191, 99, 0.14)", 
    border: "1.5px solid rgb(0, 191, 99)", 
    color: "rgb(0, 191, 99)", 
    borderRadius: "50px", 
    padding: "4px 12px", 
    fontSize: "0.85rem", 
    fontWeight: "700", 
    letterSpacing: "1px",
    display: "inline-block" // Recomendado para que el padding vertical en etiquetas <span> se aplique bien
  }}
>
  {/* VISTA: IDA */}
  {instanciaVista === 'ida' && (
    (selectedPartido.marcador1_ida === null || selectedPartido.marcador1_ida === undefined) && 
    (selectedPartido.marcador2_ida === null || selectedPartido.marcador2_ida === undefined) ? (
      <span className=" fw-bold" style={{ fontSize: '1.0rem' }}>VS</span>
    ) : (
      `${selectedPartido.marcador1_ida ?? 0} - ${selectedPartido.marcador2_ida ?? 0}`
    )
  )} 
  
  {/* VISTA: VUELTA */}
  {instanciaVista === 'vuelta' && (
    (selectedPartido.marcador1_vuelta === null || selectedPartido.marcador1_vuelta === undefined) ? (
      <span className="fw-bold" style={{ fontSize: '1.0rem' }}>VS</span>
    ) : (
      `${selectedPartido.marcador1_vuelta ?? 0} - ${selectedPartido.marcador2_vuelta ?? 0}`
    )
  )}

  {/* VISTA: PENALES */}
{/* VISTA: PENALES */}
{instanciaVista === 'tanda_penales' && (
  <div className="d-flex align-items-center justify-content-center">
    <span className="me-2 text-black" style={{ fontSize: '0.8rem' }}>P</span>
    <span>( {selectedPartido.marcador1_penales ?? 0} - {selectedPartido.marcador2_penales ?? 0} )</span>
  </div>
)}
</span>
          </div>

          {/* COLUMNA VISITANTE */}
          <div className="col-sm-4 col-4 d-flex justify-content-end align-items-center">
            <span className="team">
              {selectedPartido.equipo_b?.nombre || "Por definir"}
            </span>
            {selectedPartido.equipo_b?.archivo ? (
              <img
                src={`${Images}/${selectedPartido.equipo_b.archivo}`}
                className="logo2 TeamVisitante"
                alt={selectedPartido.equipo_b?.nombre || "Equipo"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = ErrorLogo;
                  e.target.classList.add("error-logo");
                }}
              />
            ) : (
              <img src={ErrorLogo} className="logo2 TeamVisitante error-logo" alt="Sin equipo" />
            )}
          </div>
        </div>

        {/* Global - Validando estrictamente que existan ambos marcadores antes de mostrarlo */}
        {selectedPartido.marcador1_vuelta !== null && selectedPartido.marcador1_vuelta !== undefined && (
          <div className="d-flex small mt-1">
            <strong>Global:</strong> {(selectedPartido.marcador1_ida || 0) + (selectedPartido.marcador1_vuelta || 0)} - {(selectedPartido.marcador2_ida || 0) + (selectedPartido.marcador2_vuelta || 0)}
          </div>
        )}

        <div className="text-center">
          <h4 className="hora">
            {/* falta añadir hora */}
            {selectedPartido.hora ? selectedPartido.hora.slice(0, 5) : " "}
          </h4>
                      {/* falta añadir sede */}
          <h1 className="fecha">{selectedPartido.fecha || ' '}</h1> -- 
          <h1 className="fecha">{selectedPartido.sede || ' '}</h1>
        </div>
      </div>

      {/* BOTONES DE NAVEGACIÓN DE INSTANCIAS */}
      <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
        {(() => {
          // Si no hay datos válidos de vuelta, asumimos que no tiene vuelta
          const tieneVuelta = selectedPartido.marcador1_vuelta !== null && selectedPartido.marcador1_vuelta !== undefined;
          const instanciasAMostrar = tieneVuelta ? ['ida', 'vuelta'] : ['ida'];

          return instanciasAMostrar.map((inst) => {
            let textoBoton = inst;
            if (inst === 'ida' && !tieneVuelta) {
              textoBoton = 'detalles';
            }

            return (
              <button
                key={inst}
                onClick={() => setInstanciaVista(inst)}
                className="btn d-flex align-items-center p-2   shadow-none"
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
                  display: instanciaVista === inst ? 'block' : 'none' 
                }}></div>
                <span className="text-uppercase fw-bold" style={{ fontSize: '0.8rem', color: '#000' }}>
                  {textoBoton}
                </span>
              </button>
            );
          });
        })()}

        {/* Botón de Penales */}
        {selectedPartido.marcador1_penales !== null && selectedPartido.marcador1_penales !== undefined && (
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

      {/* SECCIÓN DE EVENTOS / INCIDENCIAS */}
      <div className="eventos-timeline w-100 border-top pt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {(!eventos || eventos.length === 0) ? (
          // No hay incidencias registradas
          <p className="text-center text-muted small mt-2"> </p>
        ) : (
          <div className="eventos-timeline pt-3">
            <h6 className="text-center text-uppercase text-muted small mb-4">Detalles del partido</h6>

            <div className="row g-0">
              {/* COLUMNA EQUIPO LOCAL (A) */}
              <div className="col-6" style={{ borderRight: '2px solid #eee', color: '#ffffff' }}>
                <div className="list-group list-group-flush pe-2">
                  {eventos
                    .filter((e) => {
                      const localId = selectedPartido.equipo_aa?.id || selectedPartido.equipo_a_id;
                      return localId && e.equipo_id === localId && e.instancia === instanciaVista;
                    })
                    .map((e) => (
                      <div key={e.id} className="mb-3 fondo-imagen d-flex flex-column align-items-start">
                        <div className="d-flex align-items-center mb-1">
                          <span className="badge badge-dark me-2" style={{ fontSize: '0.7rem', marginLeft: '14px' }}>
                            {e.minuto ? `${e.minuto}'` : '-'}
                          </span>
                          <span className="evento-icono me-1">
                            {e.tipo_evento === 'gol' && '⚽'}
                            {e.tipo_evento === 'amarilla' && '🟨'}
                            {e.tipo_evento === 'roja' && '🟥'}
                            {e.tipo_evento === 'asistencia' && '👟'}
                            {e.tipo_evento === 'gol_penal' && '✅'}
                            {e.tipo_evento === 'fallo_penal' && '❌'}
                          </span>
                          <strong className="font-events-matches" style={{ marginLeft: '4px', textTransform: 'capitalize' }}>
                            {e.jugador?.nombre || 'Jugador'} {e.jugador?.apellido || ''}
                          </strong>
                        </div>
                        <small style={{ marginLeft: '48px', marginTop: '-11px', fontSize: '0.75rem', color: '#ffffff', display: 'block', textTransform: 'capitalize' }}>
                          {e.tipo_evento || ''}
                        </small>
                      </div>
                    ))}
                </div>
              </div>

              {/* COLUMNA EQUIPO VISITANTE (B) */}
              <div className="col-6">
                <div className="list-group list-group-flush ps-2">
                  {eventos
                    .filter((e) => {
                      const visitanteId = selectedPartido.equipo_b?.id || selectedPartido.equipo_b_id;
                      return visitanteId && e.equipo_id === visitanteId && e.instancia === instanciaVista;
                    })
                    .map((e) => (
                      <div key={e.id} className="mb-3 d-flex fondo-imagen flex-column align-items-end text-right">
                        <div className="d-flex align-items-center mb-1 flex-row-reverse">
                          <span className="badge badge-dark ms-2" style={{ fontSize: '0.7rem', color: '#ffffff' }}>
                            {e.minuto ? `${e.minuto}'` : '-'}
                          </span>
                          <span className="evento-icono ms-1">
                            {e.tipo_evento === 'gol' && '⚽'}
                            {e.tipo_evento === 'amarilla' && '🟨'}
                            {e.tipo_evento === 'roja' && '🟥'}
                            {e.tipo_evento === 'asistencia' && '👟'}
                            {e.tipo_evento === 'gol_penal' && '✅'}
                            {e.tipo_evento === 'fallo_penal' && '❌'}
                          </span>
                          <strong className="font-events-matches">
                            {e.jugador?.nombre || 'Jugador'} {e.jugador?.apellido || ''}
                          </strong>
                        </div>
                        <small className="text-capitalize" style={{ marginRight: '45px', marginTop: '-11px', color: '#ffffff', fontSize: '0.7rem' }}>
                          {e.tipo_evento || ''}
                        </small>
                      </div>
                    ))}
                </div>
              </div>
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
