import { Link } from "react-router-dom";
import "./index.css";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import axios from "axios";
import Cargando from "../Carga/carga";

const endpoint = 'http://localhost:8000/api';
const Images = 'http://localhost:8000/storage/uploads';

const Equipos = () => {
  const [Teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const getTeamsAll = async (page) => {
      try {
        const response = await axios.get(`${endpoint}/userTeams?page=${page}`);
        setTeams(response.data.data); // Datos de los equipos
        setCurrentPage(response.data.current_page); // Página actual
        setLastPage(response.data.last_page); // Última página
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error  teams:", error);
      }
    };

    getTeamsAll(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  return (
    <>
      <Menu />
      <section>
        {isLoading ? (
          <div className="loading-container">
            <Cargando />
          </div>
        ) : (
          <div className="margen">
            <div className="container-fluid">
              <div className="col-12 col-sm-12 col-md-12 mt-4">
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
        )}
      </section>
      <Footer />
    </>
  );
};

export default Equipos;
