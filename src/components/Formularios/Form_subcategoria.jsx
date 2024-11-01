import { useEffect, useState } from "react";
import axios from "axios";

import { API_ENDPOINT } from '../../ConfigAPI';
import "./index.css";

const endpoint = `${API_ENDPOINT}subcategoria`;
const InfoSubCategorias_endpoint = `${API_ENDPOINT}subcategorias`;
const CategoriaEndpoint = `${API_ENDPOINT}categorias`;



const FORM_Subcategoria = () => {
  const [nombre, setNombre] = useState("");

  const [CategoriaID, setCategoriaID] = useState("");
  const [Categorias, setCategorias] = useState([]);
  const [Subcategorias, setSubcategorias] = useState([]);
  const [setError] = useState(null);
  // Fetch torneos al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(CategoriaEndpoint);
        setCategorias(response.data);
      } catch (error) {
        setError("Error al cargar los categorias.");
        console.error("Error al obtener los categorias:", error);
      }
    };
    fetchCategorias();

    const InfoSubcategorias = async () => {
      try {
        const response = await axios.get(`${InfoSubCategorias_endpoint}`);
        console.log(`informacion de tabla es => ${InfoSubCategorias_endpoint}`);
        
        setSubcategorias(response.data);
      
      } catch (error) {
       
        setError("Error al cargar los subcategorias.");
        console.error("Error al obtener los subcategorias:", error);
      }
    };
    InfoSubcategorias();

  }, []);






  // Manejo del envío del formulario
  const store = async (e) => {
    e.preventDefault();
    try {
      await axios.post(endpoint, { nombre, categoria_id: CategoriaID });
    } catch (error) {
      console.error('Error al guardar la subcategoría', error);
    }
  };

  const deleteSubcategoria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta Subcategoria?')) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setSubcategorias(Subcategorias.filter((Subcategoria) => Subcategoria.id !== id));
        // Mostrar un mensaje de éxito más amigable, por ejemplo, usando un toast o snackbar
      } catch (error) {
        console.error('Error al eliminar el Subcategoria', error);
        // Mostrar un mensaje de error al usuario
      } 
    }
  };


  

  return (
    <div>
      <h1 className="text-left ">Registro de Subcategorias</h1>
      <div>

        <form className="col-md-12" onSubmit={store}>
          {/* Nombre del equipo */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Subcategoria:</label>
            <input
              type="text"
              className="form-control form-input-admin"
              id="nombre"
              placeholder="Ingrese el nombre del equipo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Selector de grupo */}
          <div className="form-group mt-3">
            <label htmlFor="grupo_id">Selecciona una categoria:</label>
            <select
              id="grupo_id"
              className="form-control"
              value={CategoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un categoria
              </option>
              {Categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="d-flex mt-2 mb-2">
            <button className="btn btn-outline-primary" type="submit">
              Enviar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla para mostrar los equipos */}
  
      <div>  
  <div className="table-responsive card my-2">   
  <table className="table ">
    <thead className="thead-light">
      <tr>
        <th className="center">Subcategoria</th>
        <th className="center">Categoria</th>
        <th className="center">Acciones</th>
      </tr>
    </thead>
    <tbody>
    {Subcategorias.map((subcategoria) => (
            <tr key={subcategoria.id}>
              
                <td className="center">{subcategoria.nombre}</td>
              <td className="center">{subcategoria.categoria.nombre}</td>
              <td className="center">
              <button
                      className="btn btn-warning fas fa-pen"
                      onClick={() => alert('Implementar editar aquí')}
                    >
                      Editar
                    </button>
                      <button
                      className="btn btn-danger far fa-trash-alt delete-btn"
                      onClick={() => deleteSubcategoria(subcategoria.id)}
                    >
                      Borrar
                    </button>
            </td>
          </tr>   
            ))} 
         
    </tbody>
  </table>
 
</div>
</div>
    </div>





  
  );
};

export default FORM_Subcategoria;
