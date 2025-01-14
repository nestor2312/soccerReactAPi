

import { useEffect, useState } from "react";
import axios from "axios";

import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import Alert from "../Alerta/Alerta";
import "./index.css";
import EditTeamModal from "../Formularios-edit/ModalEditTeams";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';

const FORM_Teams = () => {
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [GrupoID, setGrupoID] = useState("");
  const [grupos, setGrupos] = useState([]);
  const [Teams, setTeams] = useState([]);
  const [setError] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const endpoint = `${API_ENDPOINT}equipo`;
  const Infoendpoint = `${API_ENDPOINT}equipos`;
  const gruposEndpoint = `${API_ENDPOINT}grupos`;
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleUpdateTeam = async (team) => {
    try {
      // Crear un objeto FormData
      const data = {
        nombre: team.nombre,
        grupo_id: team.grupo_id,
      };
      // Si hay un archivo, convertirlo a base64
      if (team.archivo) {
        const base64Archivo = await new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          // fileReader.onloadend = () => resolve(fileReader.result.split(",")[1]);
          fileReader.onloadend = () => resolve(fileReader.result); // Mantener el prefijo completo
          fileReader.onerror = reject;
          fileReader.readAsDataURL(team.archivo);
        });
        data.archivo = base64Archivo; // Agregar el archivo convertido a base64 al objeto
        

      }
      // Enviar los datos (ya sea con o sin archivo)
      await axios.put(`${endpoint}/${team.id}`, data, {
        headers: {
          "Content-Type": "application/json", // Especifica que estamos enviando JSON
        },
      });
      console.log("Equipo actualizado correctamente");
      setAlerta({ mensaje: "Equipo actualizado exitosamente.", tipo: "success" });
      InfoEquipos(); // Refresca la lista de equipos
      setSelectedTeam(null); // Resetea la selección del equipo
    } catch (error) {
      if (error.response) {
        console.error("Error del servidor:", error.response.data);
        setAlerta({ mensaje: `Error: ${error.response.data}`, tipo: "error" });
      } else {
        console.error("Error inesperado:", error.message);
        setAlerta({ mensaje: `Error: ${error.message}`, tipo: "error" });
      }
    }
  };
  
  
  
  


  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await axios.get(gruposEndpoint);
        setGrupos(response.data);
      } catch (error) {
        setError("Error al cargar los grupos.");
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchGrupos();
  }, []);

  const InfoEquipos = async () => {
    try {
      const response = await axios.get(Infoendpoint);
      setTeams(response.data);
    } catch (error) {
      setError("Error al cargar los equipos.");
      console.error("Error al obtener los equipos:", error);
    }
  };

  useEffect(() => {
    InfoEquipos();
    document.title = "Admin - Equipos";
  }, []);

  const deleteEquipos = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setAlerta({ mensaje: "Equipo eliminado correctamente.", tipo: "success" });
        setTeams((prevTeams) => prevTeams.filter((team) => team.id !== id));
      } catch (error) {
        setError("Error al eliminar el equipo.");
        console.error("Error al eliminar el equipo:", error);
      }
    }
  };

  const store = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("grupo_id", GrupoID);
    if (archivo) formData.append("archivo", archivo);

    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      InfoEquipos();
      setAlerta({ mensaje: "Equipo registrado exitosamente.", tipo: "success" });
    } catch (error) {
      setAlerta({ mensaje: "Error al agregar el equipo.", tipo: "danger" });
      console.error("Error al enviar los datos:", error);
      setError("Error al enviar los datos.");
    }
  };

  return (
    <div>
{alerta.mensaje && (
  <Alert
    mensaje={alerta.mensaje}
    tipo={alerta.tipo}
    onClose={() => setAlerta({ mensaje: "", tipo: "" })}
  />
)}
      <h1 className="text-left">Registro de Equipos</h1>
    
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
              onChange={(e) => setNombre(e.target.value)} />
          </div>
          {/* Selector de grupo */}
          <div className="form-group mt-3">
            <label htmlFor="grupo_id">Selecciona un grupo:</label>
            <select
              id="grupo_id"
              className="form-control"
              value={GrupoID}
              onChange={(e) => setGrupoID(e.target.value)}>
              <option value="" disabled>
                Selecciona un grupo
              </option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.nombre} - {grupo.subcategoria.nombre} 
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
            Registrar Equipo
            </button>
          </div>
        </form>

      <div className="table-responsive card my-2">
        <table className="table">
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
                <td className="text-center">
                  <img
                    src={`${IMAGES_URL}/${team.archivo}`}
                    width="50%"
                    className="d-block mx-auto my-3 logomovil"
                    alt={team.nombre}
                    onError={(e) => (e.target.src = "/ruta/a/imagen-defecto.png")}
                  />
                </td>
                <td className="text-center align-middle">{team.grupo.nombre}</td>
                <td className="text-center align-middle">{team.nombre}</td>
                <td className="text-center align-middle justify-content-md-center ">
                <button
  type="button"
  className="btn btn-warning "
  data-bs-toggle="modal"
  data-bs-target="#editModal"
  onClick={() => {
    if (team) setSelectedTeam(team);
  }}
>
  <CreateIcon/>
</button>

                      <button               
                    className="btn btn-danger far fa-trash-alt delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteEquipos(team.id);
                    }}
                  >
                     <DeleteOutlineIcon/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       <EditTeamModal
        team={selectedTeam} 
        onUpdate={handleUpdateTeam} 
        grupos={grupos} />
      </div>
    </div>
  );
};

export default FORM_Teams;

