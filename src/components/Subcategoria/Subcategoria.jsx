import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import Cargando from "../Carga/carga";
import { API_ENDPOINT } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import Logo from "../../assets/Frame_49.png"
const Subcategoria = () => {
  const { categoriaId } = useParams(); // Obtenemos el id de la categoría desde la URL
  const location = useLocation();  
   const torneoId = location.state?.torneoId; 
  const [subcategorias, setSubcategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}categoria/${categoriaId}/subcategorias`
        );
        setSubcategorias(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError("error al cargar los partidos");
        console.error("Error al obtener los partidos:", error);
      }
    };

    fetchSubcategorias();
  }, [categoriaId]);

  useEffect(() => {
    document.title = "Subcategorías";
  }, []);

     useEffect(() => {
        document.body.classList.add("fondo-1");
        return () => {
          document.body.classList.remove("fondo-1");
        };
      }, []);
  


  return (
    <>
    <nav className="navbar navbar-expand-lg fondomenu start-0 end-0 p-1 ">
              <div className="container-fluid ">
               
                <Link to="/">
                    <img className="LOGO" src={Logo} alt="Nombre de la Web Logo" />
                  </Link>
               
              </div>
            </nav>
      <h2 className="text-center text-title mt-2">Subcategorías</h2>
      {isLoading ? (
        <div className="loading-container">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container">
          <ErrorCarga />
        </div>
      ) : subcategorias.length > 0 ? ( // Condición para mostrar las subcategorías si hay datos
        <div>
          <div className="contenido">
            {subcategorias.map((subcategoria) => (
              <div key={subcategoria.id} className="box">
                <Link  className="BoxCard"
                  to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoria.id}/inicio`}
                >
                  <div className="card_torneo">
                    <button className="boton-torneo btn-button-general">
                      <span>{subcategoria.nombre}</span>
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {torneoId ? (
        <Link to={`/torneo/${torneoId}/categorias`} className='btn-back-h'>
          <button className="btn-back">
            <span>Volver a categorías</span>
          </button>
        </Link>
      ) : (
        <Link to={`/`}>
          <button className="btn-back">
            <span>Volver a torneos</span>
          </button>
        </Link>
      )}
        </div>
      ) : (
        <p className="no-datos">No hay subcategorías disponibles.</p> // Mostrar este mensaje si no hay datos
      )}
    </>
  );
};

export default Subcategoria;
