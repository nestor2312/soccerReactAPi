import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { API_ENDPOINT } from "../../ConfigAPI";

const endpoint = `${API_ENDPOINT}grupo`;
const Infoendpoint = `${API_ENDPOINT}grupos`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

const FORM_Groups = () => {
  const [nombre, setNombre] = useState("");
  const [Subcategorias, setSubcategoria] = useState([]);
  const [Grupos, setGrupos] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [error, setError] = useState(null);

  // Cargar subcategorías y grupos al cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcategoriasRes, gruposRes] = await Promise.all([
          axios.get(subcategoriasEndpoint),
          axios.get(Infoendpoint),
        ]);
        setSubcategoria(subcategoriasRes.data);
        setGrupos(gruposRes.data);
      } catch (error) {
        setError("Error al cargar los datos.");
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  // Eliminar un grupo
  const deleteGrupo = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        // Recargar los grupos después de eliminar
        const response = await axios.get(Infoendpoint);
        setGrupos(response.data);
      } catch (error) {
        setError("Error al eliminar el grupo.");
        console.error("Error al eliminar el grupo:", error);
      }
    }
  };

  // Guardar un nuevo grupo
  const store = async (e) => {
    e.preventDefault();
    try {
      await axios.post(endpoint, { nombre, subcategoria_id: SubcategoriaID });
      setNombre("");
      setSubcategoriaID("");
      // Recargar los grupos después de agregar
      const response = await axios.get(Infoendpoint);
      setGrupos(response.data);
    } catch (error) {
      setError("Error al guardar el grupo.");
      console.error("Error al guardar el grupo", error);
    }
  };

  return (
    <div className="w-100">
      <h1 className="text-left">Registro de Grupos</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      
      {/* Formulario para agregar un grupo */}
      <form className="col-md-12" onSubmit={store}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Grupo:</label>
          <input
            type="text"
            className="form-control form-input-admin"
            id="nombre"
            placeholder="Ingrese el nombre del grupo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="subcategoria_id">Selecciona una Subcategoría:</label>
          <select
            id="subcategoria_id"
            className="form-control"
            value={SubcategoriaID}
            onChange={(e) => setSubcategoriaID(e.target.value)}
          >
            <option value="" disabled>
              Selecciona una subcategoría
            </option>
            {Subcategorias.map((subcategoria) => (
              <option key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex mt-2 mb-2">
          <button className="btn btn-outline-primary" type="submit">
            Enviar
          </button>
        </div>
      </form>

      {/* Tabla de grupos */}
      <div className="table-responsive card my-2">
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th className="center">Subcategoría</th>
              <th className="center">Grupo</th>
              <th className="center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Grupos.map((Grupo) => (
              <tr key={Grupo.id}>
                <td className="center">{Grupo.subcategoria.nombre}</td>
                <td className="center">{Grupo.nombre}</td>
                <td className="center">
                  <a href={`/grupos/${Grupo.id}/edit`} className="btn btn-warning fas fa-pen">
                    Editar
                  </a>
                  <button
                    className="btn btn-danger far fa-trash-alt delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteGrupo(Grupo.id);
                    }}
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
  );
};

export default FORM_Groups;
