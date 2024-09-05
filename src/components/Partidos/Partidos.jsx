import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import "./index.css";
import axios from "axios";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const Partidos = () => {
  const [partidos, setPartidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getPartidos = async () => {
      try {
        const response = await axios.get(`${endpoint}/partidos`);
        setPartidos(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error al obtener los partidos:", error);
      }
    };

    getPartidos();
  }, []);

  return (
    <>
      <Menu />
      {isLoading ? (
          <div className="loading-container">
          <Cargando/>
            
          </div>
       
        ) : (
      <section className="Partidos">
        <div className="margen mt-4">
          <div className="row">
            {partidos.map((partido) => (
              <div className="col-md-4 mb-4" key={partido.id}>
                <div className="card card-matches d-flex justify-content-center align-items-center">
                  <div className="card-body d-flex justify-content-center align-items-center">
                    <div className="row">
                      <div className="col-4 d-flex justify-content-start align-items-center">
                        <img
                          src={`${Images}/${partido.equipo_a.archivo}`} 
                          className="logo2"
                          alt={partido.equipo_a.nombre}
                        />
                        <span className="team">{partido.equipo_a.nombre}</span>
                        {/* <span className="team">{partido.equipoA.nombre}</span> */}
                      </div>
                      <div className="col-4 d-flex flex-wrap align-content-around justify-content-center">
                        <span className="score">{partido.marcador1} - {partido.marcador2}</span>
                      </div>
                      <div className="col-4 d-flex justify-content-end align-items-center">
                        <span className="team">{partido.equipo_b.nombre}</span>
                        <img
                          src={`${Images}/${partido.equipo_b.archivo}`}  // Ruta de la imagen del equipo B
                          className="logo2"
                          alt={partido.equipo_b.nombre}
                        />
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
      <Footer />
    </>
  );
};

export default Partidos;


