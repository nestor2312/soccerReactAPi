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

  useEffect(() => {
    document.title = "Equipos";
  }, []);


  return (
    <>
      <Menu />
      {/* <Navbar></Navbar> */}
      <section>
        {isLoading ? (
          <div className="loading-container">
            <Cargando />
          </div>
        ) :  error ? (
          <div className="loading-container">
             <ErrorCarga/>
          </div>
        )  : Teams.length > 0 ? (
    
          <div className="margen margen-mobile">
            <div className="container-fluid">
              <div className="col-12 col-sm-12 col-md-12 mt-4 mb-5">
                <div className="card border-0 shadow">
                  <div className="card-header fondo-card TITULO border-0">
                    Equipos
                  </div>
                  <div className="card-body box-team">
                    {Teams.map((team) => (
                      <div key={team.id} className="row justify-content-around">
                        <Link to="link" className="team-item2">
                          <div className="inner-card mt-3 d-flex flex-wrap align-content-end justify-content-center">
                            <div>
                              <img
                                src={`${Images}/${team.archivo}`}
                                width="50%"
                                className="d-block mx-auto my-3 logomovil"
                                alt={team.nombre}
                              />
                              <h6 className="text-center team">{team.nombre}</h6>
                              {/* <h6 className="text-center team">grupo = {team.grupo.nombre}</h6> */}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="pagination mb-4">
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
          </div>
         ) : (
          <p className="no-datos">No hay Jugadores disponibles en este momento.</p> // Mostrar este mensaje si no hay datos
        )}
      </section>
      <Footer />
    </>
  );
};

export default Equipos;
