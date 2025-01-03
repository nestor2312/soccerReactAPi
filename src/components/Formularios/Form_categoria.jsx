import { useEffect, useState } from "react";
import axios from "axios";

import { API_ENDPOINT } from '../../ConfigAPI';
import "./index.css";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import ModalEdit from "../Formularios-edit/ModalEdit";

const endpoint = `${API_ENDPOINT}categoria`;
const InfoCategorias_endpoint = `${API_ENDPOINT}categorias`;
const TorneosEndpoint = `${API_ENDPOINT}torneos`;


const FORM_Categoria = () => {
  
  const [selectedCategoria, setSelectedCategoria] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [TorneoID, setTorneoID] = useState("");
  const [Torneos, setTorneos] = useState([]);
  const [Categorias, setCategorias] = useState([]);
  const [setError] = useState(null);
  const [error] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  
  const categoriasFields = [
    { name: "nombre", label: "Nombre de la Categoría", required: true },
    {
      name: "torneo_id",
      label: "Seleccionar Torneo",
      type: "select",
      required: true,
      options: Torneos.map((torneo) => ({
        value: torneo.id,
        label: torneo.nombre,
      })),
    },
  ];

  const saveCategoria = async (updatedCategoria) => {
    try {
      await axios.put(`${API_ENDPOINT}categoria/${updatedCategoria.id}`, updatedCategoria);
      fetchCategorias(); 
      setAlerta({ mensaje: "Categoria actualizada correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      setTorneos((prevCategorias) =>
        prevCategorias.map((c) => (c.id === updatedCategoria.id ? updatedCategoria : c))
      
      );
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      setAlerta({ mensaje: "Error al actualizar la categoria!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    }
  };

  // Función para obtener las categorías
  const fetchCategorias = async () => {
    try {
      const response = await axios.get(`${InfoCategorias_endpoint}`);
      setCategorias(response.data);
      setIsLoading(false);
    } catch (error) {
      setError("Error al cargar las categorías.");
      console.error("Error al obtener las categorías:", error);
      setIsLoading(false);
    }
  };

  // useEffect para cargar torneos y categorías solo cuando el componente se monta
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get(TorneosEndpoint);
        setTorneos(response.data);
      } catch (error) {
        setError("Error al cargar los torneos.");
        console.error("Error al obtener los torneos:", error);
      }
    };

    fetchTorneos();
    fetchCategorias();
  }, []); 

  // Manejo del envío del formulario
  const store = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(endpoint, { nombre, torneo_id: TorneoID });
      // Actualiza las categorías después de agregar una nueva
      fetchCategorias(); 
      setNombre("");
      setTorneoID("");
      setAlerta({ mensaje: "¡Categoría registrada con éxito!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    } catch (error) {
      console.error('Error al guardar la categoría', error);
      setAlerta({ mensaje: "Error al registrar la categoría.", tipo: "danger" });
    }finally {
      setIsLoading(false); 
    }
  };

  // borrar
  const deleteCategoria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoria?')) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setCategorias(Categorias.filter((Categoria) => Categoria.id !== id));
        setAlerta({ mensaje: "¡Categoría eliminada con éxito!", tipo: "success" });
       
      } catch (error) {
        console.error('Error al eliminar la categoria', error);
        setAlerta({ mensaje: "Error al eliminar la categoría.", tipo: "danger" });
      } 
    }
  };

  useEffect(() => {
    document.title = "Admin - Categorías";
  }, []);


  return (
    <>
    {isLoading ? (
      <div className="loading-container">
        <Cargando/>
      </div>
    ) :  error ? (
      <div className="loading-container">
         <ErrorCarga/>
      </div>
    ) : (

    <div>
      {alerta.mensaje && (
  <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
    {alerta.mensaje}
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      onClick={() => setAlerta({ mensaje: "", tipo: "" })}
    ></button>
  </div>
)}
      <h1 className="text-left">Registro de Categorías</h1>
      <div>
        <form className="col-md-12" onSubmit={store}>
          {/* Nombre de la categoría */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Categoría:</label>
            <input
              type="text"
              className="form-control form-input-admin"
              id="nombre"
              placeholder="Ingrese el nombre de la categoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Selector de torneo */}
          <div className="form-group mt-3">
            <label htmlFor="torneo_id">Selecciona un torneo:</label>
            <select
              id="torneo_id"
              className="form-control"
              value={TorneoID}
              onChange={(e) => setTorneoID(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un torneo
              </option>
              {Torneos.map((torneo) => (
                <option key={torneo.id} value={torneo.id}>
                  {torneo.nombre}
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

      {/* Tabla para mostrar las categorías */}
      <div>
        <div className="table-responsive card my-2">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th className="center">Torneo</th>
                <th className="center">Categoría</th>
                <th className="center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Categorias.map((Categoria) => (
                <tr key={Categoria.id}>
                  <td className="center">{Categoria.torneo.nombre}</td>
                  <td className="center">{Categoria.nombre}</td>
                  <td className="center">
                   
                  <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setSelectedCategoria(Categoria)}
                              >Editar</button>
                      <button
                      className="btn btn-danger far fa-trash-alt delete-btn"
                      onClick={() => deleteCategoria(Categoria.id)}
                    >
                      Borrar
                    </button>
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalEdit
  data={selectedCategoria}
  type="Categoría"
  fields={categoriasFields}
  onSave={saveCategoria}
/>;
        </div>
      </div>
    </div>
  )}
   </>
  );
};

export default FORM_Categoria;
