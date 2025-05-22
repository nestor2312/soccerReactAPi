import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import { useParams } from "react-router-dom";
import TablaEstadisticas from "../estadisticas/TablaEstadisticas"; // Asegúrate de importar el componente


const endpoint = API_ENDPOINT;

const Estadisticas = () => {
  const { subcategoriaId } = useParams();
  const [jugadores, setJugadores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getJugadores = async () => {
      try {
        const response = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/jugadores`);
        
        // Ordenar jugadores por cada estadística
        const jugadoresPorRojas = [...response.data]
          .sort((a, b) => b.card_roja - a.card_roja)
          .slice(0, 5);

        const jugadoresPorAmarillas = [...response.data]
          .sort((a, b) => b.card_amarilla - a.card_amarilla)
          .slice(0, 5);

        const jugadoresPorGoles = [...response.data]
          .sort((a, b) => b.goles - a.goles)
          .slice(0, 5);

        const jugadoresPorAsistencias = [...response.data]
          .sort((a, b) => b.asistencias - a.asistencias)
          .slice(0, 5);

        // Almacenar los datos organizados
        setJugadores({
          rojas: jugadoresPorRojas,
          amarillas: jugadoresPorAmarillas,
          goles: jugadoresPorGoles,
          asistencias: jugadoresPorAsistencias,
        });

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Error al cargar los jugadores");
        console.error("Error al obtener los jugadores:", error);
      }
    };

    getJugadores();
  }, [subcategoriaId]);

  useEffect(() => {
    document.title = "Estadisticas";
  }, []);

  return (
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
        )  : jugadores.rojas ? ( 
          <main className="main-content">
      
     
      <section>
        <div className="margen">

          <div className="row ">
            <div className="col-12 col-md-6 ">
              <TablaEstadisticas
                titulo="Goles"
                campo="goles"
                jugadores={jugadores.goles}
              />
            </div>
            <div className="col-12 col-md-6 mb-1">
              <TablaEstadisticas
                titulo="Asistencias"
                campo="asistencias"
                jugadores={jugadores.asistencias}
              />
            </div>
            <div className="col-12 col-md-6">
              <TablaEstadisticas
                titulo="Tarjetas rojas"
                campo="card_roja"
                jugadores={jugadores.rojas}
              />
            </div>
            <div className="col-12 col-md-6 ">
              <TablaEstadisticas
                titulo="Tarjetas amarillas"
                campo="card_amarilla"
                jugadores={jugadores.amarillas}
              />
            </div>
           
          </div>
        </div>
        <div style={{ height: "15px" }}></div>
        </section>
        </main>
      ) : (
        <p className="no-datos">No hay Estadisticas disponibles en este momento.</p>
      )}
     {!isLoading  && !error && <Footer/>}
     </div>
    
  );
};

export default Estadisticas;
