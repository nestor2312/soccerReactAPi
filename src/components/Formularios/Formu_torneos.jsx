/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import CreateIcon from '@mui/icons-material/Create';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ModalEdit from "../Formularios-edit/ModalEdit";
import { API_ENDPOINT } from '../../ConfigAPI';
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import Swal from "sweetalert2";


const endpoint = `${API_ENDPOINT}torneo`;

const Infoendpointp = `${API_ENDPOINT}torneosp`;
const torneoFields = [
  { name: "nombre", label: "Nombre del Torneo", required: true },
];

const FORM_Torneos = () => {

 
  const [selectedTorneo, setSelectedTorneo] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [Nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [Torneos, setTorneos] = useState([]);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  const saveTorneo = async (updatedTorneo) => {
    try {
      await axios.put(`${API_ENDPOINT}torneo/${updatedTorneo.id}`, updatedTorneo);
      setAlerta({ mensaje: "Torneo actualizado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      setTorneos((prevTorneos) =>
        prevTorneos.map((t) => (t.id === updatedTorneo.id ? updatedTorneo : t))
      
      );
    } catch (error) {
      console.error("Error al actualizar el torneo:", error);
      setAlerta({ mensaje: "Error al actualizar el torneo!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };

    // Manejo del envío del formulario
    const store = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const formData = new FormData();
      formData.append("nombre", Nombre);
  
      try {
        await axios.post(endpoint, formData);
        // Actualizar la lista de torneos después de agregar un nuevo torneo
        InfoTorneosp();
        setNombre("");
        setAlerta({ mensaje: "Torneo registrado con éxito!", tipo: "success" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      } catch (error) {
        console.error("Error al guardar el torneo", error);
        setAlerta({ mensaje: "Error al registrar el torneo.", tipo: "danger" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      } finally {
        setIsLoading(false); // Detén el estado de carga
      }
    
    };


  const deleteTorneo = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este torneo después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${endpoint}/${id}`);
          setTorneos(Torneos.filter((Torneo) => Torneo.id !== id));
          setAlerta({ mensaje: "Torneo eliminado con éxito!", tipo: "success" });
          InfoTorneosp();
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        
        } catch (error) {
          console.error("Error al eliminar el torneo", error);
          setAlerta({ mensaje: "Error al eliminar la categoría.", tipo: "danger" });
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
          Swal.fire("Error", "No se pudo eliminar el torneo.", "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  // Función para obtener los torneos


const InfoTorneosp = async () => {
  try {
      const response = await axios.get(`${Infoendpointp}?page=${currentPage}`);
      setTorneos(response.data.data); // Para acceder a los datos en `data`
      setLastPage(response.data.last_page); // Usa `last_page` devuelto desde Laravel
      setIsLoading(false);
  } catch (error) {
      setError("Error al cargar los Torneos.");
      console.error("Error al obtener los Torneos:", error);
      setIsLoading(false);
  }
};




  // useEffect para cargar los torneos solo una vez al montar el componente
  useEffect(() => {
    setIsLoading(true);
    InfoTorneosp();
  }, [currentPage]);
  

  useEffect(() => {
    document.title = "Admin - Torneos";
  }, []);

  useEffect(() => {
    document.body.classList.add("admin-background");
    return () => {
      document.body.classList.remove("admin-background");
    };
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
    ) : Torneos.length > 0 ? (

      <><div>
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
            </div>
            <div>
                <h1 className="text-left ">Registro de Torneos</h1>
                <div>
                  <form className="col-md-12 mt-2 mb-4" onSubmit={store} autoComplete="off" >
                    {/* Nombre del torneo */}
                    <div className="form-group">
                      <label htmlFor="nombre">Nombre del Torneo:</label>
                      <input
                        type="text"
                        className="form-control form-input-admin"
                        id="nombre"
                        placeholder=" Copa tapita, Torneo Relámpago"
                        value={Nombre}
                        required
                        onChange={(e) => setNombre(e.target.value)} />
                    </div>

                    {/* Botón para enviar el formulario */}
                    <div className="d-flex mt-2 mb-2">
                      <button className="btn btn-outline-primary" type="submit">
                      Registrar Torneo
                      </button>
                    </div>
                  </form>
                </div>

                {/* Tabla para mostrar los torneos */}
                <div>
                  <div className="table-responsive card my-2">
                    <table className="table">
                      <thead className="thead-light">
                        <tr>
                          <th className="center">Torneo</th>
                          <th className="text-center">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Torneos.map((Torneo) => (
                          <tr key={Torneo.id}>
                            <td className="center">{Torneo.nombre}</td>
                            <td className="text-center d-flex justify-content-evenly">

                              <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setSelectedTorneo(Torneo)}
                              ><CreateIcon/></button>

                              <button
                                className="btn btn-danger far fa-trash-alt delete-btn"
                                onClick={() => deleteTorneo(Torneo.id)}
                              >
                              <DeleteOutlineIcon/>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Modal para editar torneos */}

                    <ModalEdit
  data={selectedTorneo}
  type="Torneo"
  fields={torneoFields}
  onSave={saveTorneo}
/>
                    {/* <ModalEdit
                      torneo={selectedTorneo}
                      onSave={saveTorneo} /> */}
                  </div>
                  <div className="pagination mb-4">
                    <button
                    
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                     ← Anterior
                    </button>
                    <span>{`Página ${currentPage} de ${lastPage}`}</span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lastPage}
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              </div></>
      ) : (
        <p className="no-datos">No hay datos disponibles en este momento.</p> // Mostrar este mensaje si no hay datos
      )}
    </>
  );
};

export default FORM_Torneos;
