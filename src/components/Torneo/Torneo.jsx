import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";

const Torneo = () => {
  const [torneos, setTorneos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTorneosAll = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}torneo`);
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

  return (
    <>
    <h1 className="text-center text-title">torneo</h1>
      {isLoading ? (
        <div className="loading-container">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container">
          <ErrorCarga />
        </div>
      ) : (
        <div className="contenido">
              {/* <h1>Torneo</h1> */}
          {torneos.map((torneo) => (
            
            <div key={torneo.id} className="box">
              <Link to={`/torneo/${torneo.id}/categorias`}>
                <div className="card_torneo">
                  <button className="boton-torneo">
                    <span>{torneo.nombre}</span>
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Torneo;



            // <div className="contenido">
            //   <div className="box">
            //     <div className="card_torneo">
            //       <button className="boton-torneo"><span>ddd</span></button>
            //     </div>
            //   </div>