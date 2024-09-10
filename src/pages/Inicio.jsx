import { useEffect, useState } from "react";
import Footer from "../components/Footer/Footer"
import Menu from "../components/Menu/Menu"
import axios from "axios";
import './../App.css'
import Cargando from "../components/Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../ConfigAPI';
import ErrorCarga from "../components/Error/Error";

const endpoint = `${API_ENDPOINT}`;

const Images = IMAGES_URL;



const Inicio = ()=>{
    const [Teams, setTeams] = useState([]);
    const [Matches, setMatches] = useState([]);
    const [clasificacion, setclasificacion] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
      const getTeamsAll = async () => {
        try {
          const response = await axios.get(`${endpoint}/userHomeTeams`);
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
          const response = await axios.get(`${endpoint}/partidos`);
          const filteredMatches = response.data.slice(0, 7);
          setMatches(filteredMatches);
        } catch (error) {
          setError("Error al cargar los partidos");
          console.error("Error  Matches:", error);
        }
      };
      const getclasificacion = async () => {
        try {
          const response = await axios.get(`${endpoint}/clasificacion`);
          const filteredClasificacion = response.data.slice(0, 1);
          setclasificacion(filteredClasificacion);
        } catch (error) {
          setError("Error al cargar los partidos");
          console.error("Error  clasificacion:", error);
        }
      };
      getclasificacion()
      getMatchesAll()
      getTeamsAll();
    }, []);


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

    
    </div>
  </div>
    </section>
        )}
<Footer/>
</>
}
export default Inicio