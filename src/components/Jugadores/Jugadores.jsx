

// import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";
import { useParams } from "react-router-dom";

const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const Jugadores = () => {
  const { subcategoriaId } = useParams();
  const [jugadores, setJugadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getJugadores = async () => {
      try {
        // const response = await axios.get(`${endpoint}/jugadores`);
        const response = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/jugadores`);
        setJugadores(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('error al cargar los jugadores')
        console.error("Error al obtener los jugadores:", error);
      }
    };

    getJugadores();
  }, [subcategoriaId]);

  
  useEffect(() => {
    document.title = "Jugadores";
  }, []);
  return ( <>
    <Menu/>
    {isLoading ? (
          <div className="loading-container">
          <Cargando/>
            
          </div>
       
        )  :  error ? (
          <div className="loading-container">
             <ErrorCarga/>
          </div>
        )  : jugadores.length > 0 ? (
    <section className="margen Jugadores mt-4">
    
    
      <div className="container-fluid ">  
        <div className="row hiden2">
        {jugadores.map((Player) => (
          <div key={Player.id} className="col-md-4 mb-4 ">
            <div className="team-item2">         
              <div className="card card-matches card-hover d-flex justify-content-center align-items-center">
                  <div className="card-body  d-flex justify-content-center align-items-center ">
                      <div className="row">
                          <div className="col-7 d-flex justify-content-around align-items-center">
                          <img
                          src={`${Images}/${Player.equipo.archivo}`} 
                          className="logo2"
                          alt={Player.equipo.nombre}
                        /> 
                         <span className="team ">{Player.numero} { Player.equipo.nombre }</span>    
                          </div>
                          <div className="col-5 d-flex justify-content-center align-items-center">
                            <span className="team ">{ Player.nombre } {Player.apellido}</span>   

                        </div>
                          
                      </div>
                  </div>
              </div>
          </div>
          </div>  
        ))}
        </div>
        </div>
        
    </section>
        ) : (
          <p className="no-datos">No hay Jugadores disponibles en este momento.</p> // Mostrar este mensaje si no hay datos
        )}
    <Footer/>
    </>

  );
}

export default Jugadores;
