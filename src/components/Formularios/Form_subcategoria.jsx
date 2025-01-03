import { useEffect, useState } from "react";
import axios from "axios";

import { API_ENDPOINT } from '../../ConfigAPI';
import "./index.css";
import ModalEdit from "../Formularios-edit/ModalEdit";

const endpoint = `${API_ENDPOINT}subcategoria`;
const InfoSubCategorias_endpoint = `${API_ENDPOINT}subcategorias`;
const CategoriaEndpoint = `${API_ENDPOINT}categorias`;
const TorneoEndpoint = `${API_ENDPOINT}torneos`;



const FORM_Subcategoria = () => {
  const [nombre, setNombre] = useState("");
  const [CategoriaID, setCategoriaID] = useState("");
  const [Categorias, setCategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [Subcategorias, setSubcategorias] = useState([]);
  const [Torneos, setTorneos] = useState([]);
  const [setError] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const subcategoriaFields = [
    { name: "nombre", label: "Nombre de la Subcategoria", required: true },
    {
      name: "categoria_id",
      label: "Seleccionar una Categoria",
      type: "select",
      required: true,
      options: Categorias.map((categoria) => ({
        value: categoria.id,
        label:`${categoria.nombre} - ${categoria.torneo.nombre}`,
      })),
    },
  ];

  const saveSubcategoria = async (updatedSubcategoria) => {
    console.log('datos enviados al back en update =', updatedSubcategoria)
    try {
      await axios.put(`${API_ENDPOINT}subcategoria/${updatedSubcategoria.id}`, updatedSubcategoria);
      InfoSubcategorias(); 
      setAlerta({ mensaje: "Subcategoria actualizada correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      setTorneos((prevSubcategorias) =>
        prevSubcategorias.map((c) => (c.id === updatedSubcategoria.id ? updatedSubcategoria : c))
      
      );
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      setAlerta({ mensaje: "Error al actualizar la categoria!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    }
  };

  // Fetch torneos, categorias y subcategorias al cargar el componente
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

    const fetchTorneos = async () => {
      try {
        const response = await axios.get(TorneoEndpoint);
        setTorneos(response.data);
      } catch (error) {
        setError("Error al cargar los torneos.");
        console.error("Error al obtener los torneos:", error);
      }
    };

    
    fetchCategorias();
    fetchTorneos();
    InfoSubcategorias();
  }, []);
  
  const InfoSubcategorias = async () => {
    try {
      const response = await axios.get(InfoSubCategorias_endpoint);
      setSubcategorias(response.data);
    } catch (error) {
      setError("Error al cargar los subcategorias.");
      console.error("Error al obtener los subcategorias:", error);
    }
  };
  // Manejo del envío del formulario
  const store = async (e) => {
    e.preventDefault();
    try {
      await axios.post(endpoint, { nombre, categoria_id: CategoriaID });
      InfoSubcategorias();
      setAlerta({ mensaje: "Subcategorias registrada con éxito!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      setNombre("");
      setCategoriaID("");
    } catch (error) {
      console.error('Error al guardar la subcategoría', error);
    }
  };

  const deleteSubcategoria = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta Subcategoria?')) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setAlerta({ mensaje: "Subcategorias eliminada correctamente!", tipo: "danger" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
        setSubcategorias(Subcategorias.filter((Subcategoria) => Subcategoria.id !== id));
      } catch (error) {
        console.error('Error al eliminar el Subcategoria', error);
      } 
    }
  };

  useEffect(() => {
    document.title = "Admin - Subcategoria";
  }, []);

  return (
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
      <h1 className="text-left ">Registro de Subcategorias</h1>
      <div>
        <form className="col-md-12" onSubmit={store}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Subcategoria:</label>
            <input
              type="text"
              className="form-control form-input-admin"
              id="nombre"
              placeholder="Ingrese el nombre de la subcategoría"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Selector de categoria */}
          <div className="form-group mt-3">
            <label htmlFor="grupo_id">Selecciona una categoría:</label>
            <select
              id="grupo_id"
              className="form-control"
              value={CategoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {Categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre} - {categoria.torneo.nombre}
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

      {/* Tabla para mostrar las subcategorías */}
      <div>  
        <div className="table-responsive card my-2">   
          <table className="table ">
            <thead className="thead-light">
              <tr>
                <th className="center">Subcategoria</th>
                <th className="center">Categoria</th>
                <th className="center">Torneo</th>
                <th className="center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Subcategorias.map((subcategoria) => (
                <tr key={subcategoria.id}>
                  <td className="center">{subcategoria.nombre}</td>
                  <td className="center">{subcategoria.categoria.nombre}</td>
                  <td className="center">
                    {Torneos.find(torneo => torneo.id === subcategoria.categoria.torneo_id)?.nombre || "No disponible"}
                  </td>
                  <td className="center">
                  <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setSelectedSubcategoria(subcategoria)}
                              >Editar</button>
                    
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
          <ModalEdit
  data={selectedSubcategoria}
  type="Subcategoría"
  fields={subcategoriaFields}
  onSave={saveSubcategoria}
/>
        </div>
      </div>
    </div>
  );
};

export default FORM_Subcategoria;
