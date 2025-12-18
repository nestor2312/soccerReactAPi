import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import Logo from "../../assets/Frame_49.png"
const Torneo = () => {
  const [torneos, setTorneos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTorneosAll = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}torneos`);
        setTorneos(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('Error al cargar los torneos');
        console.error("Error al obtener los torneos:", error);
      }
    };

    getTorneosAll();
  }, []);
  useEffect(() => {
    document.title = "Torneos";
  }, []);

     useEffect(() => {
        document.body.classList.add("fondo-1");
        return () => {
          document.body.classList.remove("fondo-1");
            document.body.classList.remove("login-background");
        };
      }, []);
  


  return (
    <>
    <div className=""> 
<nav className="navbar navbar-expand-lg fondomenu start-0 end-0 p-1 ">
          <div className="container-fluid ">
          
              <Link to="/">
                  <img className="LOGO" src={Logo} alt="Nombre de la Web Logo" />
                </Link>
            <Link
        to={`/login`}
        className={`redirect-login log`}
      >
        Ingresar
      </Link>
          </div>
        </nav>
    <h1 className="text-center text-title mt-2">competiciones</h1>
   
      {isLoading ? (
        <div className="loading-container">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container">
          <ErrorCarga />
        </div>
      ) : (

        
        <div className="contenido fondo-1">
        
          
              {/* <h1>Torneo</h1> */}
          {torneos.map((torneo) => (
            
            <div key={torneo.id} className="box">
              <Link to={`/torneo/${torneo.id}/categorias`} className="BoxCard">
                <div className="card_torneo">
                  <button className="boton-torneo btn-button-general">
                    <span>{torneo.nombre}</span>
                  </button>
                </div>
              </Link>
            </div>
          ))}
          
        </div>
      )}
</div>
    </>
  );
};

export default Torneo;


