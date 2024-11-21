import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import Cargando from "../Carga/carga";
import { API_ENDPOINT } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";

const Subcategoria = () => {
  const { categoriaId } = useParams(); // Obtenemos el id de la categoría desde la URL
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

  return (
    <>
      <h1 className="text-center text-title mt-2">Subcategorías</h1>
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
                <Link
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
        </div>
      ) : (
        <p className="no-datos">No hay subcategorías disponibles.</p> // Mostrar este mensaje si no hay datos
      )}
    </>
  );
};

export default Subcategoria;
