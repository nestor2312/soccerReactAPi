import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '../../ConfigAPI';
import axios from "axios";

import Cargando from '../Carga/carga';
import ErrorCarga from '../Error/Error';

const Categoria = () => {
  const { id } = useParams(); // Obtenemos el id del torneo desde la URL
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}torneo/${id}/categorias`);
        setCategorias(response.data); 
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false); 
        setError('Error al cargar las categorías');
        console.error("Error fetching categorías:", error);
      }
    };

    fetchCategorias();
  }, [id]);

  return (
    <>
      <h3 className="text-center text-title mt-2">champions</h3>
     <h1 className="text-center text-title mt-2">categorias</h1>
      {isLoading ? (
        <div className="loading-container">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container">
          <ErrorCarga />
        </div>
      ) : (
        <div>
           <div className="contenido">
           {categorias.map((categoria) => (
            <div key={categoria.id} className="box">
              <Link to={`/torneo/categoria/${categoria.id}/subcategoria`}>
                <div className="card_torneo">
                  <button className="boton-torneo btn-button-general">
                    <span>{categoria.nombre}</span>
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
         
        </div>
      )}
    </>
  );
};

export default Categoria;
