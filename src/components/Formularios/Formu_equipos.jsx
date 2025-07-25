

import { useEffect, useState } from "react";
import axios from "axios";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import Alert from "../Alerta/Alerta";
import "./index.css";
import EditTeamModal from "../Formularios-edit/ModalEditTeams";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';
import Swal from "sweetalert2";
const FORM_Teams = () => {
  const [nombre, setNombre] = useState("");
  const [color_hover, setcolor_hover] = useState("");
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [error] = useState(null);
  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  const handleUpdateTeam = async (team) => {
    try {
      // Crear un objeto FormData
      const data = {
        nombre: team.nombre,
        grupo_id: team.grupo_id,
        color_hover: team.color_hover,
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
      const response = await axios.get(`${Infoendpoint}?page=${currentPage}`);
      setTeams(response.data.data);
      setLastPage(response.data.last_page);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError("Error al cargar los equipos.");
      console.error("Error al obtener los equipos:", error);
    }
  };

  useEffect(() => {
    document.title = "Admin - Equipos";
    InfoEquipos();
  }, [currentPage]);

  const deleteEquipos = async (id) => {

    
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este equipo después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${endpoint}/${id}`);
  setTeams(Teams.filter((Team) => Team.id !== id));
  setAlerta({ mensaje: "Equipo eliminado correctamente!", tipo: "success" });
  InfoEquipos();
  setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        
        } catch (error) {
          console.error("Error al eliminar el equipo", error);
          setAlerta({ mensaje: "Error al eliminar el equipo!", tipo: "success" });
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
          Swal.fire("Error", "No se pudo eliminar el equipo.", "error");
        } 
      }
    });

   
  };

  const store = async (e) => {
    
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("grupo_id", GrupoID);
     formData.append("color_hover", color_hover);
    if (archivo) formData.append("archivo", archivo);

    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      InfoEquipos();
      setAlerta({ mensaje: "Equipo registrado exitosamente.", tipo: "success" });
      setNombre("");
      setArchivo("");
    } catch (error) {
      setAlerta({ mensaje: "Error al agregar el equipo.", tipo: "danger" });
      console.error("Error al enviar los datos:", error);
      setError("Error al enviar los datos.");
    }finally {
      setIsLoading(false); 
    }
  };

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
  <Alert
    mensaje={alerta.mensaje}
    tipo={alerta.tipo}
    onClose={() => setAlerta({ mensaje: "", tipo: "" })}
  />
)}
      <h1 className="text-left">Registro de Equipos</h1>
    
      <form className="col-md-12 mt-2 mb-4" onSubmit={store} autoComplete="off">
          {/* Nombre del equipo */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Equipo:</label>
            <input
            required
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
              required
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
              required
              type="file"
              className="form-control  form-input-admin"
              id="archivo"
              onChange={(e) => setArchivo(e.target.files[0])}
            />
          </div>
           {/* color */}
          <div className="form-group">
 <label htmlFor="color_hover">Color de fondo</label>
            <input
             type="color"
    id="color_hover"
    name="color_hover"
           
            
              className="form-control form-input-admin"
            
              placeholder="Ingrese el color del equipo"
              value={color_hover}
              onChange={(e) => setcolor_hover(e.target.value)} />
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
              <th className="text-center">Color de equipo</th>
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
                 <td className="text-center align-middle">{team.color_hover}</td>
                <td className="text-center align-middle justify-content-md-center ">
                <button
  type="button"
  className="btn btn-warning mx-3"
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
      <div className="pagination mb-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    aria-disabled={currentPage === 1}
    className="btn btn-outline-primary"
  >
    ← Anterior
  </button>
  <span className="mx-2">{`Página ${currentPage} de ${lastPage}`}</span>
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === lastPage}
    aria-disabled={currentPage === lastPage}
    className="btn btn-outline-primary"
  >
    Siguiente →
  </button>
</div>
    </div>
   
  )}
  </>
 );
 };
export default FORM_Teams;

