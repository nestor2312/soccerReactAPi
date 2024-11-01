import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

import { API_ENDPOINT } from '../../ConfigAPI';

const endpoint = `${API_ENDPOINT}grupo`;
const Infoendpoint = `${API_ENDPOINT}grupos`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

const FORM_Groups = () => {
  const [nombre, setNombre] = useState("");
  const [Subcategorias, setSubcategoria] = useState([]); // Corregido el nombre del setter
  const [Grupos, setGrupos] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [setError] = useState(null);

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await axios.get(subcategoriasEndpoint);
        setSubcategoria(response.data); // Corregido el setter
      } catch (error) {
        setError("Error al cargar las subcategorías.");
        console.error("Error al obtener las subcategorías:", error);
      }
    };
    fetchSubcategorias();

    const fetchGrupos = async () => {
      try {
        const response = await axios.get(Infoendpoint);
        setGrupos(response.data);
      } catch (error) {
        setError("Error al cargar los grupos.");
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, []);

  const store = async (e) => {
    e.preventDefault();
    try {
      await axios.post(endpoint, { nombre, subcategoria_id: SubcategoriaID });
      // Vuelve a cargar los grupos para actualizar la lista
      const response = await axios.get(Infoendpoint);
      setGrupos(response.data);
    } catch (error) {
      console.error('Error al guardar el grupo', error);
    }
  };

  return (
    <div className="w-100">
      <h1 className="text-left">Registro de Grupos</h1>
      <div>
        <form className="col-md-12" onSubmit={store}>
          {/* Nombre del grupo */}
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

          {/* Selector de subcategoría */}
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

          {/* Botón para enviar el formulario */}
          <div className="d-flex mt-2 mb-2">
            <button className="btn btn-outline-primary" type="submit">
              Enviar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla para mostrar los grupos */}
      <div>
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
                  <td className="center">{Grupo.subcategoria.nombre}</td> {/* Mostrar el nombre de la subcategoría */}
                  <td className="center">{Grupo.nombre}</td> {/* Mostrar el nombre del grupo */}
                  <td className="center">
                    <form action="" method="post">
                      <a href={`/grupos/${Grupo.id}/edit`} className="btn btn-warning fas fa-pen">
                        Editar
                      </a>
                      <button type="submit" className="btn btn-danger far fa-trash-alt delete-btn">
                        Borrar
                      </button>
                    </form>
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

export default FORM_Groups;
