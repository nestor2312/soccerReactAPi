import { Link } from "react-router-dom";
import "./index.css";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import axios from "axios";
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";
import { useParams } from 'react-router-dom';
import ErrorLogo from "../../assets/Vector.svg";
// import Navbar from "../nav/nav";
const endpoint = API_ENDPOINT;
const Images =IMAGES_URL;

const Equipos = () => {
  const [Teams, setTeams] = useState([]);
  const { subcategoriaId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [lastPage, setLastPage] = useState(1);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEquipos = async () => {
      try {
        const response = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/equipos`);
        setTeams(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("Error al cargar los equipos.");
        console.error("Error al obtener los equipos:", error);
      }
    };

    fetchEquipos();
  }, [subcategoriaId]);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  function getTextColor(bgColor) {
  if (!bgColor) return '#000000'; // color por defecto
  const color = bgColor.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128 ? '#ffffff' : '#000000';
}





  useEffect(() => {
    document.title = "Equipos";
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
        ) : Teams.length > 0 ? (
          <main className="main-content">
      
          
          <section>
          <div className="margen margen-mobile">
            <div className="container-fluid">
              <div className="col-12 col-sm-12 col-md-12 mt-4 mb-3">
                <div className="card border-0 shadow">
                  <div className="card-header fondo-card TITULO border-0">
                    Equipos
                  </div>
                  <div className="card-body box-team">
  {/* {Teams.map((team) => {
    const textColor = getTextColor(team.color_hover); 

    return (
      <div key={team.id} className="mx-1">
        <Link 
          to={`/torneo/categoria/${subcategoriaId}/equipo/${team.id}/jugadores`} 
          className="team-item2 BoxCard"
        >
          <div 
            className="inner-card  mt-3 d-flex flex-wrap align-content-end justify-content-center"
            style={{
              '--hover-color': team.color_hover,
              '--hover-text-color': textColor,
               transition: 'background 0.4s ease, color 0.4s ease'
            }}
          >
            <div>
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
              <h6 className="text-center team-hover ">{team.nombre}</h6>
            </div>
          </div>
        </Link>
     
  


      </div>
      
    );
  })} */}

  {Teams.map((team) => {
    const textColor = getTextColor(team.color_hover); 

    return (
      <div key={team.id} className="mx-1">
        {/* <h1>modificar</h1> */}
        <Link 
          to={`/torneo/categoria/${subcategoriaId}/equipo/${team.id}/jugadores`} 
          className="team-item2 BoxCard"
        >
         
           
        
          <div className="caja1  mt-3 d-flex flex-wrap align-content-end justify-content-center" style={{
              '--hover-color': team.color_hover,
              '--hover-text-color': textColor,
               transition: 'background 0.4s ease, color 0.4s ease'
            }}>
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
   <h6 className="text-center team-hover l">{team.nombre}</h6>
    </div>
  </div>
        </Link>

 
  
</div>


   
      
    );
  })}
</div>


                </div>
                  <div className="pagination mt-4 mb-3">
                    <button
                    
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                     ← Anterior
                    </button>
                    <span>{`Página ${currentPage} de ${lastPage}`}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lastPage}
                    >
                      Siguiente →
                    </button>
                  </div>
              </div>
            </div>
          </div>
      </section>
      </main>
         ) : (
          <p className="no-datos">No hay Equipos disponibles en este momento.</p> 
        )}
  {!isLoading  && !error && <Footer/>}
     </div>
     );
};

export default Equipos;
