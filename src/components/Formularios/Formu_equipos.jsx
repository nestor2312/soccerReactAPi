import { useEffect, useState } from "react";
import axios from "axios";

import { API_ENDPOINT,IMAGES_URL } from '../../ConfigAPI';
import "./index.css";

const endpoint = `${API_ENDPOINT}equipo`;
const Infoendpoint = `${API_ENDPOINT}equipos`;
const gruposEndpoint = `${API_ENDPOINT}grupos`;
const Images =IMAGES_URL;


const FORM_Teams = () => {
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [GrupoID, setGrupoID] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [Teams, setTeams] = useState([]);
  const [setError] = useState(null);
  // Fetch grupos al cargar el componente
  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axios.get(gruposEndpoint);
        setGrupos(response.data);
      } catch (error) {
        setError("Error al cargar los equipos.");
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();

    const InfoEquipos = async () => {
      try {
        const response = await axios.get(`${Infoendpoint}`);
        setTeams(response.data);
      
      } catch (error) {
       
        setError("Error al cargar los equipos.");
        console.error("Error al obtener los equipos:", error);
      }
    };
    InfoEquipos();

  }, []);

  // Manejo del envío del formulario
  const store = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("grupo_id", GrupoID);
    if (archivo) formData.append("archivo", archivo);

    try {
      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Datos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  };

  return (
    <div>
      <h1 className="text-left ">Registro de Equipos</h1>
      <div>

        <form className="col-md-12" onSubmit={store}>
          {/* Nombre del equipo */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Equipo:</label>
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
            <label htmlFor="grupo_id">Selecciona un grupo:</label>
            <select
              id="grupo_id"
              className="form-control"
              value={GrupoID}
              onChange={(e) => setGrupoID(e.target.value)}
            >
              <option value="" disabled>
                Selecciona un grupo
              </option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Input para el archivo */}
          <div className="form-group mt-3">
            <label htmlFor="archivo">Añadir Archivo:</label>
            <input
              type="file"
              className="form-control  form-input-admin"
              id="archivo"
              onChange={(e) => setArchivo(e.target.files[0])}
            />
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
        <th className="text-center">Logo</th>
        <th className="text-center">Grupo</th>
        <th className="text-center">Equipo</th>
        <th className="text-center">Acciones</th>
      </tr>
    </thead>
    <tbody>
      {Teams.map((team) => (
        <tr key={team.id}>
          {/* Centramos el logo */}
          <td className="text-center">
            <img
            onError={'eorro'}
              src={`${Images}/${team.archivo}`}
              width="50%"
              className="d-block mx-auto my-3 logomovil"
              alt={team.nombre}
            />
          </td>
          
          {/* Centramos el nombre del grupo */}
          <td className="text-center align-middle">{team.grupo.nombre}</td>

          {/* Centramos el nombre del equipo */}
          <td className="text-center align-middle">{team.nombre}</td>

          {/* Centramos las acciones */}
          <td className="text-center align-middle">
            <button
              className="btn btn-warning fas fa-pen mx-2"
              // onClick={() => (team.id)}
            >
              Editar
            </button>
            <button
              className="btn btn-danger far fa-trash-alt mx-2"
              onClick={() => (team.id)}
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

export default FORM_Teams;
