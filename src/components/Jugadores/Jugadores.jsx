

// import { Link } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";

const endpoint = 'https://hip-parts-nail.loca.lt/api';
const Images = 'https://hip-parts-nail.loca.lt/storage/uploads'

const Jugadores = () => {
  const [jugadores, setJugadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getJugadores = async () => {
      try {
        const response = await axios.get(`${endpoint}/jugadores`);
        setJugadores(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error al obtener los jugadores:", error);
      }
    };

    getJugadores();
  }, []);

  return ( <>
    <Menu/>
    {isLoading ? (
          <div className="loading-container">
          <Cargando/>
            
          </div>
       
        ) : (
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
          )}
    <Footer/>
    </>

  );
}

export default Jugadores;
