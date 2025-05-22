import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer"
import Menu from "../components/Menu/Menu"
import axios from "axios";
import './../App.css'
import Cargando from "../components/Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../ConfigAPI';
import ErrorCarga from "../components/Error/Error";
import { Link, useParams } from 'react-router-dom';
const endpoint = `${API_ENDPOINT}`;

const Images = IMAGES_URL;


const Inicio = ()=>{
  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);
  const partidosEsperadosCuartos = 4;
  const partidosEsperadosSemis = 2;
  const partidosEsperadosFinal = 1;

  let partidosCuartos = [...eliminatoriasCuartos];
  let partidosSemis = [...eliminatoriasSemis];
  let partidoFinal = [...eliminatoriasFinal];

  while (partidosCuartos.length < partidosEsperadosCuartos) {
    partidosCuartos.push({
      equipo_a: null,
      equipo_b: null,
      marcador1: null,
      marcador2: null,
    });
  }
  while (partidosSemis.length < partidosEsperadosSemis) {
    partidosSemis.push({
      equipo_a: null,
      equipo_b: null,
      marcador1: null,
      marcador2: null,
    });
  }
  while (partidoFinal.length < partidosEsperadosFinal) {
    partidoFinal.push({
      equipo_a: null,
      equipo_b: null,
      marcador1: null,
      marcador2: null,
    });
  }




  const { subcategoriaId } = useParams();
    const [Teams, setTeams] = useState([]);
    const [Matches, setMatches] = useState([]);
    const [clasificacion, setclasificacion] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      const getTeamsAll = async () => {
        try {
          // const response = await axios.get(`${endpoint}/userHomeTeams`);
          const response = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/equipos`);

          const filteredteams = response.data.slice(0, 9);
          setTeams(filteredteams);
          setIsLoading(false)
        } catch (error) {
          setIsLoading(false)
          setError("Error al cargar los partidos");
          console.error("Error  teams:", error);
        }
      };
      const getMatchesAll = async () => {
        try {
          // const response = await axios.get(`${endpoint}/partidos`);
          const response = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/partidos`);

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
         
          const eliminatoriasData = response.data; // Almacenar la respuesta en una variable
          setEliminatoriasCuartos(eliminatoriasData.cuartos || []);
          setEliminatoriasSemis(eliminatoriasData.semis || []);
          setEliminatoriasFinal(eliminatoriasData.final || []);
        } catch (error) {
          console.error("Error al obtener los partidos:", error);
          // Mostrar un mensaje de error al usuario
          // eslint-disable-next-line no-undef
          setError('Ocurrió un error al cargar los datos');
        }
      }


      const getclasificacion = async () => {
        try {
            const response = await axios.get(
                `${API_ENDPOINT}subcategoria/${subcategoriaId}/Inicioclasificacion`
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
        const adicional = palabras[1].charAt(1).toUpperCase() || palabras[0].charAt(1).toUpperCase();
    
        return (
          primeraLetraPrimeraPalabra + 
          primeraLetraSegundaPalabra + 
          adicional
        ).slice(0, 3); // Asegurar 3 caracteres
      }
    
      // Si solo hay una palabra, tomar los primeros 3 caracteres
      return nombre.slice(0, 3).toUpperCase();
    };

useEffect(() => {
  document.title = "Inicio";
}, []);
return(

<div className="layout">
<Menu/>
{isLoading ? (
      <div className="loading-container">
        <Cargando/>
      </div>
    ) : error ? (
      <div className="loading-container">
         <ErrorCarga/>
      </div>
    ) : (
      <main className="main-content">
     
<section className="Subcategoria">
      <div className="margen">

    <div className="row">
    {clasificacion.map((datosGrupo) => (
      <div className="col-sm-12 col-md-6 mt-4"  key={datosGrupo.id}>
        <div className="card border-0 shadow ">
          <div className="card-header fondo-card TITULO border-0">Clasificacion</div>
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
              {datosGrupo.equipos.map((equipo ) => (
                    <tr key={equipo.id}   >
      
                    <th>
                    <img
                      src={`${Images}/${equipo.archivo}`}
                      width="5%"
                      className="logo"
                      alt={equipo.nombre}
                    />

                    </th>

                    <th className="movil text-left team"  width="25%">
                      {equipo.nombre}
                    </th>
                    <th className="movil data">{equipo.pj}</th>
                    <th className="movil data">{equipo.pg}</th>
                    <th className="movil data">{equipo.pe}</th>
                    <th className="movil data">{equipo.pp}</th>
                    <th className="movil data">{equipo.gf}</th>
                    <th className="movil data hidenb">{equipo.gc}</th>
                    <th className="movil data">{equipo.gd}</th>
                    <th className="movil data">{equipo.puntos}</th>
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
      <div className="card-header fondo-card TITULO border-0">Partidos</div>
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
          />
        </td>

      
        <td className="text-left team" width="30%">
          {partido.equipo_a.nombre}
        </td>

      
        <td className="text-center" width="20%">
          {partido.marcador1 == null || partido.marcador2 == null ? (
            <div>
              <span className="fecha">{partido.fecha}</span>
              <span className="hora">{formatearHora(partido.hora)}</span>
            </div>
          ) : (
            <div >
              <span className="data text-right">{partido.marcador1}</span>
              <span className=" data"> - </span> 
              <span className="data text-left">{partido.marcador2}</span>
            </div>
          )}
        </td>

      
        <td className="text-right team" width="30%">
          {partido.equipo_b.nombre}
        </td>

      
        <td width="10%">
          <img
            src={`${Images}/${partido.equipo_b.archivo}`}
            className="logo"
            width="100%"
            alt={partido.equipo_b.nombre}
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
    <div className="card-header fondo-card TITULO border-0">Equipos</div>
    <div className="card-body ">
      <div className="box-team">
        {Teams.map((team) => (
           // eslint-disable-next-line react/jsx-key
          <div key={team.id} className="team-item">
            <div className="inner-card d-flex flex-wrap align-content-end justify-content-center">
              <div>
            <Link  to={`/torneo/categoria/${subcategoriaId}/equipo/${team.id}/jugadores`} >
                <img
                  src={`${Images}/${team.archivo}`}
                  className="img-fluid d-block mx-auto my-2 logomovil"
                  alt={team.nombre}
                />
                <h6 className="text-center team">{team.nombre}</h6>
          </Link>
              </div>
            </div>
          </div>
        ))}
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
            <div className="titulos">
              <div className="titulo">Cuartos</div>
              <div className="titulo">Semis</div>
              <div className="titulo">Final</div>
              <div className="titulo">Campeón</div>
            </div>
            <div>
            <div className="esquema">
                <div className="jornada_contenedor">
                {/* Cuartos */}
                {partidosCuartos.map((partido, index) => {
   const marcador1_ida = partido.marcador1_ida;
   const marcador1_vuelta = partido.marcador1_vuelta;
   const marcador2_ida = partido.marcador2_ida;
   const marcador2_vuelta = partido.marcador2_vuelta;
 
   // Calcular los marcadores globales si hay marcador de vuelta
   const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
   const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;
 
   // Condiciones para determinar el ganador
   const isLocalWinner = marcador1_global > marcador2_global || 
                         (marcador1_global === marcador2_global && partido.marcador1_penales > partido.marcador2_penales);
   const isVisitanteWinner = marcador2_global > marcador1_global || 
                             (marcador2_global === marcador1_global && partido.marcador2_penales > partido.marcador1_penales);
 
  return (
    <div className="partido" key={index}>
      <div className="jornada">
        {/* Equipo Local */}
        <div
          className={`jugador ${isLocalWinner ? "win" : isVisitanteWinner ? "lose" : ""}`}
        >
          <img
            src={`${Images}/${partido.equipo_aa?.archivo}`}
            alt=""
            className="logo" 
          />
          <span className="equipo">
          {partido.equipo_aa ? abreviarNombre(partido.equipo_aa.nombre) : "por definir"}
          </span>
          <span className="goles">
            {marcador1_ida} {marcador1_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador1_vuelta && ` (${marcador1_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `  (${partido.marcador1_penales})` : ""}
          </span>
        </div>

        {/* Equipo Visitante */}
        <div
          className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
        >
          <img
            src={`${Images}/${partido.equipo_b?.archivo}`}
            alt=""
            className="logo" 
          />
          <span className="equipo">
          {partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre) : "por definir"}
          </span>
          <span className="goles">
            {marcador2_ida} {marcador2_vuelta || ""}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador2_vuelta && ` (${marcador2_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `(${partido.marcador2_penales})` : ""}
          </span>
        </div>
      </div>
    </div>
  );
})}


                </div>

                {/* {{-- Conectores de octavos a cuartos --}} */}
                <div className="conectores">
                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>
                </div>

                {/* {{--semis --}} */}
                <div className="jornada_contenedor">
  {partidosSemis.map((partido, index) => {
     const marcador1_ida = partido.marcador1_ida;
     const marcador1_vuelta = partido.marcador1_vuelta;
     const marcador2_ida = partido.marcador2_ida;
     const marcador2_vuelta = partido.marcador2_vuelta;
   
     // Calcular los marcadores globales si hay marcador de vuelta
     const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
     const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;
   
     // Condiciones para determinar el ganador
     const isLocalWinner = marcador1_global > marcador2_global || 
                           (marcador1_global === marcador2_global && partido.marcador1_penales > partido.marcador2_penales);
     const isVisitanteWinner = marcador2_global > marcador1_global || 
                               (marcador2_global === marcador1_global && partido.marcador2_penales > partido.marcador1_penales);
   
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
            />
            <span className="equipo">
            {partido.equipo_aa ? abreviarNombre(partido.equipo_aa.nombre) : "por definir"}
            </span>
            <span className="goles">
            {marcador1_ida} {marcador1_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador1_vuelta && ` (${marcador1_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `  (${partido.marcador1_penales})` : ""}
            </span>
          </div>
        </div>
        
        <div className="jornada" key={`visitante-${index}`}>
          <div
            className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
          >
            <img
              src={`${Images}/${partido.equipo_b?.archivo}`}
              alt=""
              className="logo" 
            />
            <span className="equipo">
            {partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre) : "por definir"}
            </span>
            <span className="goles">
            {marcador2_ida} {marcador2_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador2_vuelta && ` (${marcador2_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `  (${partido.marcador2_penales})` : ""}
            </span>
          </div>
        </div>
      </>
    );
  })}
</div>


                {/* {{-- Conectores de cuartos a semifinal --}} */}
                <div className="conectores">
                  <div className="conector">
                    <div className="conector_doble conector_doble_semifinal"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble conector_doble_semifinal"></div>
                    <div className="conector_simple"></div>
                  </div>
                </div>
                {/* {{-- final --}}     */}
                <div className="jornada_contenedor">
  {partidoFinal.map((partido, index) => {
     const marcador1_ida = partido.marcador1_ida;
     const marcador1_vuelta = partido.marcador1_vuelta;
     const marcador2_ida = partido.marcador2_ida;
     const marcador2_vuelta = partido.marcador2_vuelta;
   
     // Calcular los marcadores globales si hay marcador de vuelta
     const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
     const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;
   
     // Condiciones para determinar el ganador
     const isLocalWinner = marcador1_global > marcador2_global || 
                           (marcador1_global === marcador2_global && partido.marcador1_penales > partido.marcador2_penales);
     const isVisitanteWinner = marcador2_global > marcador1_global || 
                               (marcador2_global === marcador1_global && partido.marcador2_penales > partido.marcador1_penales);
   
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
            />
            <span className="equipo">
            {partido.equipo_aa ? abreviarNombre(partido.equipo_aa.nombre) : "por definir"}
            </span>
            <span className="goles">
            {marcador1_ida} {marcador1_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador1_vuelta && ` (${marcador1_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `  (${partido.marcador1_penales})` : ""}
            </span>
          </div>
        </div>

        <div className="jornada" key={`visitante-${index}`}>
          <div className="conector_doble"></div>
          <div className="conector_simple"></div>
          <div
            className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
          >
            <img
              src={`${Images}/${partido.equipo_b?.archivo}`}
              alt=""
              className="logo"
            />
            <span className="equipo">
            {partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre) : "por definir"}
            </span>
            <span className="goles">
            {marcador2_ida} {marcador2_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador2_vuelta && ` (${marcador2_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `  (${partido.marcador2_penales})` : ""}
            </span>
          </div>
        </div>
      </>
    );
  })}
</div>


                {/* {{-- Conectores de semifinal a ganador --}} */}
                <div className="conectores">
                  <div className="conector">
                    <div className="conector_doble conector_doble_ganador"></div>
                    <div className="conector_simple"></div>
                  </div>
                </div>

                {/* Ganador */}
                <div className="ganador">
    <div className="conector_doble"></div>
    <div className="conector_simple"></div>

    {/* Verificar si ambos marcadores de ida y vuelta están presentes */}
    {partidoFinal[0] && partidoFinal[0].marcador1_ida !== null && partidoFinal[0].marcador2_ida !== null ? (
      (() => {
        // Calcular el marcador global solo si hay marcador de vuelta
        const marcador1_global = partidoFinal[0].marcador1_vuelta !== null
          ? partidoFinal[0].marcador1_ida + partidoFinal[0].marcador1_vuelta
          : partidoFinal[0].marcador1_ida;
        const marcador2_global = partidoFinal[0].marcador2_vuelta !== null
          ? partidoFinal[0].marcador2_ida + partidoFinal[0].marcador2_vuelta
          : partidoFinal[0].marcador2_ida;

        // Determinar el equipo ganador considerando marcador global y penales
        const isLocalWinner = marcador1_global > marcador2_global ||
                              (marcador1_global === marcador2_global && partidoFinal[0].marcador1_penales > partidoFinal[0].marcador2_penales);
        const isVisitanteWinner = marcador2_global > marcador1_global ||
                                  (marcador2_global === marcador1_global && partidoFinal[0].marcador2_penales > partidoFinal[0].marcador1_penales);

        // Asignar el equipo ganador
        // partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre)
        const equipoGanador = isLocalWinner ? partidoFinal[0].equipo_aa : isVisitanteWinner ? partidoFinal[0].equipo_b : null;

        return equipoGanador ? (
          <div className="jugador win">
            <img
              src={`${Images}/${equipoGanador.archivo}`}
              className="logo"
              alt={equipoGanador.nombre}
            />
            <span className="equipo fw-bold">{abreviarNombre(equipoGanador.nombre)}</span>
          </div>
        ) : (
          <div className="jugador">
            <span className="equipo">Por definir ganador</span>
          </div>
        );
      })()
    ) : (
      <div className="jugador">
        <span className="equipo">Por definir ganador</span>
      </div>
    )}
  </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      

    
    </div>
  
    </section>
    </main>

        )}
 {!isLoading &&  !error && <Footer/>}
</div>
);
}
export default Inicio