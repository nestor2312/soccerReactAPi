import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer"
import Menu from "../components/Menu/Menu"
import axios from "axios";
import './../App.css'
import Cargando from "../components/Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../ConfigAPI';
import ErrorCarga from "../components/Error/Error";
import { useParams } from 'react-router-dom';
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

          const filteredteams = response.data.slice(0, 8);
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

          const filteredMatches = response.data.slice(0, 7);
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
          // const response = await axios.get(`${endpoint}clasificacion`);
          const response = await axios.get(
            `${API_ENDPOINT}subcategoria/${subcategoriaId}/Inicioclasificacion`
          );
          const filteredClasificacion = response.data.slice(0, 1);
          setclasificacion(filteredClasificacion);
        } catch (error) {
          setError("Error al cargar los partidos");
          console.error("Error  clasificacion:", error);
        }
      };

      getEliminatorias();
      getclasificacion();
      getMatchesAll();
      getTeamsAll();
    }, [subcategoriaId]);

    


return<>
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
                <th className="movil titulo2 hiden">gc</th>
                <th className="movil titulo2">gd</th>
                <th className="movil titulo2">pts</th> 
              </tr>
              </thead> 
              <tbody>
              {datosGrupo.equipos.map((equipo, index) => (
                    <tr key={equipo.id =1}   className={index < 2 ? "fila-resaltada" : ""} >
        
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
                    <td className="movil data  hiden">{equipo.gc}</td>
                    <td className="movil data">{equipo.gd}</td>
                    <td className="movil data">{equipo.puntos}</td>
                  </tr>
                 ))}
              </tbody> 
            </table>
          </div>
          {/* {{-- <button class="botonUno btn-block" ><span><a href="matches" class="matches">ver Clasificacion</a></span></button>     --} */}
        </div>
      </div>
        ))}
      <div className="col-sm-12 col-md-6 mt-4">
        <div className="card border-0 shadow">
          <div className="card-header fondo-card TITULO border-0">Partidos</div>
          <div className="card table-responsive border-0 table-sm">         
            <table className="table-borderless">
              <thead>
              <th></th>
                      <th className="titulo2 texto-left">Local</th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th className="titulo2 texto-right">Visitante</th>
                      <th></th>
              </thead>
              <tbody>
              {Matches.map((partido) => (
                  <tr key={partido.id} width="10%">
                    <td width="10%">
                     <img
                          src={`${Images}/${partido.equipo_a.archivo}`} 
                          className="logo" width="100%"
                          alt={partido.equipo_a.nombre}
                        />
                    </td>
                     
                      <td className="texto-left " >{partido.equipo_a.nombre}</td>
                      <td className=" data"> {partido.marcador1}</td>
                      <td className=" data">-</td>
                      <td className=" data"> {partido.marcador2}</td>
                      <td className="texto-right " >{partido.equipo_b.nombre}</td>
                      <td width="10%">
                     <img
                          src={`${Images}/${partido.equipo_b.archivo}`} 
                          className="logo" width="100%"
                          alt={partido.equipo_b.nombre}
                        />

                    </td>
                  </tr>





 ))}
              </tbody>
          </table>  
          </div>
        </div>
        {/* {{-- <button class="botonUno btn-block" ><span><a href="matches" class="matches">ver mas partidos</a></span></button>    --}} */}
      </div>
      <div className="col-12 col-sm-12 col-md-12 mt-4">
  <div className="card border-0 shadow">
    <div className="card-header fondo-card TITULO border-0">Equipos</div>
    <div className="card-body ">
      <div className="box-team">
        {Teams.map((team) => (
          <div key={team.id} className="team-item">
            <div className="inner-card d-flex flex-wrap align-content-end justify-content-center">
              <div>
                <img
                  src={`${Images}/${team.archivo}`}
                  className="img-fluid d-block mx-auto my-3 logomovil"
                  alt={team.nombre}
                />
                <h6 className="text-center team">{team.nombre}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

     {/* Esquema de eliminatorias */}

     <div className="col-sm-12 col-md-12 mt-4">
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
            {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"}
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
            {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
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
    // Definir valores de ida y vuelta para global y penales
    const marcador1_ida = partido.marcador1_ida || '';
    const marcador1_vuelta = partido.marcador1_vuelta || '';
    const marcador2_ida = partido.marcador2_ida || '';
    const marcador2_vuelta = partido.marcador2_vuelta || '';

    // Calcular el marcador global solo si hay marcador de vuelta
    const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
    const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

    // Determinar el ganador en caso de ida/vuelta o en penales
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
              {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador1_ida} - {marcador1_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador1_vuelta && ` (Global: ${marcador1_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? ` | Penales: ${partido.marcador1_penales}` : ""}
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
              {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador2_ida} - {marcador2_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador2_vuelta && ` (Global: ${marcador2_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? ` | Penales: ${partido.marcador2_penales}` : ""}
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
    // Definir valores de ida y vuelta y global
    const marcador1_ida = partido.marcador1_ida || '';
    const marcador1_vuelta = partido.marcador1_vuelta || '';
    const marcador2_ida = partido.marcador2_ida || '';
    const marcador2_vuelta = partido.marcador2_vuelta || '';

    // Calcular el marcador global solo si hay marcador de vuelta
    const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
    const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

    // Determinar el ganador con marcador global y penales
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
              {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador1_ida} - {marcador1_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador1_vuelta && ` (Global: ${marcador1_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? ` | Penales: ${partido.marcador1_penales}` : ""}
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
              {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador2_ida} - {marcador2_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador2_vuelta && ` (Global: ${marcador2_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? ` | Penales: ${partido.marcador2_penales}` : ""}
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
                <div className="ganador_esquema">
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
        const equipoGanador = isLocalWinner ? partidoFinal[0].equipo_aa : isVisitanteWinner ? partidoFinal[0].equipo_b : null;

        return equipoGanador ? (
          <div className="jugador win">
            <img
              src={`${Images}/${equipoGanador.archivo}`}
              className="logo"
              alt={equipoGanador.nombre}
            />
            <span className="equipo">{equipoGanador.nombre}</span>
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
      

    
    </div>
  
    </section>
        )}
<Footer/>
</>
}
export default Inicio