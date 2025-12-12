import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import ModalEditMatches from "../Formularios-edit/ModalEditMatches";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import Swal from "sweetalert2";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
const endpoint = `${API_ENDPOINT}partido`;

const FORM_Matches = () => {
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [torneoId, setTorneoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [grupoId, setGrupoId] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(true);
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [marcador1, setMarcador1] = useState("");
  const [marcador2, setMarcador2] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");
  const [equipoVisitanteID, setEquipoVisitante] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error] = useState(null);
  // eslint-disable-next-line no-unused-vars
 const handleEditClick = async (partido) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}partidos/${partido.id}`);
    const data = response.data;

    const mappedPartido = {
      id: data.id,
      torneoId: data.equipo_a?.grupo?.subcategoria?.categoria?.torneo?.id || "",
      categoriaId: data.equipo_a?.grupo?.subcategoria?.categoria?.id || "",
      subcategoriaId: data.equipo_a?.grupo?.subcategoria?.id || "",
      grupoId: data.equipo_a?.grupo?.id || "",
      equipoA_id: data.equipo_a?.id || "",
      equipoB_id: data.equipo_b?.id || "",
      marcador1: data.marcador1,
      marcador2: data.marcador2,
      fecha: data.fecha,
      hora: data.hora,
    };

    setSelectedPartido(mappedPartido);
    setShowModal(true);
  } catch (error) {
    console.error("Error al cargar datos del partido:", error);
  }
};



  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartido(null); // Limpiar los datos del partido
  };

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  const savePartido = async (updatedPartido) => {
    try {
      console.log("Datos enviados al backend:", updatedPartido);
      // Actualizar partido en el backend
      await axios.put(
        `${API_ENDPOINT}partido/${updatedPartido.id}`,
        updatedPartido
      );

      fetchPartidos();
      // Mostrar alerta de éxito
      setAlerta({
        mensaje: "¡Partido actualizado correctamente!",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    } catch (error) {
      // Manejar errores
      console.error("Error al actualizar el partido:", error);
      setAlerta({
        mensaje: "¡Error al actualizar el partido!",
        tipo: "danger",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    document.title = "Admin - Partidos";
  }, []);

  // carga torneos
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}torneos`);
        setTorneos(response.data);
      } catch (error) {
        console.error("Error al cargar los torneos:", error);
      }
    };
    fetchTorneos();
  }, []);

  // carga categorias
  useEffect(() => {
    if (torneoId) {
      const fetchCategorias = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINT}categorias/${torneoId}`
          );
          setCategorias(response.data);
          setSubcategorias([]); // Resetea niveles inferiores
          setGrupos([]);
          setCategoriaId(""); // Resetea selección
          setSubcategoriaId("");
          setGrupoId("");
        } catch (error) {
          console.error("Error al cargar categorías:", error);
        }
      };
      fetchCategorias();
    } else {
      setCategorias([]);
    }
  }, [torneoId]);

  // carga subcategorias
  useEffect(() => {
    if (categoriaId) {
      const fetchSubcategorias = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINT}categoria/${categoriaId}/subcategorias`
          );
          setSubcategorias(response.data);
          setGrupos([]); // Resetea niveles inferiores
          setSubcategoriaId(""); // Resetea selección
          setGrupoId("");
        } catch (error) {
          console.error("Error al cargar subcategorías:", error);
        }
      };
      fetchSubcategorias();
    } else {
      setSubcategorias([]);
    }
  }, [categoriaId]);

  // carga grupos
  useEffect(() => {
    if (subcategoriaId) {
      const fetchGrupos = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINT}grupos/${subcategoriaId}`
          );
          setGrupos(response.data);
          setGrupoId(""); // Resetea selección
        } catch (error) {
          console.error("Error al cargar grupos:", error);
        }
      };
      fetchGrupos();
    } else {
      setGrupos([]);
    }
  }, [subcategoriaId]);

  // carga equipos
  useEffect(() => {
    if (grupoId) {
      const fetchEquipos = async () => {
        try {
          const response = await axios.get(`${API_ENDPOINT}equipos/${grupoId}`);
          setEquipos(response.data);
        } catch (error) {
          console.error("Error al cargar equipos:", error);
        }
      };
      fetchEquipos();
    } else {
      setEquipos([]);
    }
  }, [grupoId]);

  const fetchPartidos = async () => {
    try {
      const response = await axios.get(
        `${API_ENDPOINT}partidos?page=${currentPage}`
      );
      setPartidos(response.data.data);
      setLastPage(response.data.last_page);
    } catch (error) {
      console.error("Error al cargar los partidos:", error);
    }finally {
      setIsLoading(false); // Se asegura de ocultar la carga cuando finaliza la petición
    }
  };

  const store = async (e) => {
    e.preventDefault();
  
    if (equipoLocalID === equipoVisitanteID) {
      Swal.fire({
        title: "Los equipos no pueden ser el mismo!",
        text: "Seleccione 2 equipos diferentes para registrar el partido",
        icon: "warning",

        cancelButtonText: "Cancelar",
      });
      return;
    }

    const formData = new FormData();
    formData.append("marcador1", marcador1);
    formData.append("marcador2", marcador2);
    formData.append("equipoA_id", equipoLocalID);
    formData.append("equipoB_id", equipoVisitanteID);
    formData.append("fecha", fecha);
    formData.append("hora", hora);

    try {
      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlerta({
        mensaje: "¡Partido registrado correctamente!",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      fetchPartidos();
    } catch (error) {
      setAlerta({
        mensaje: "¡Error al registrar el partido!",
        tipo: "success",
      });
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  };

  useEffect(() => {
    fetchPartidos();
   
  }, [currentPage]);

  // Eliminar partido
  const deletePartidos = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este partido después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${endpoint}/${id}`);
          setPartidos(partidos.filter((partido) => partido.id !== id));
          setAlerta({
            mensaje: "Partido eliminado correctamente!",
            tipo: "success",
          });
          fetchPartidos();
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        } catch (error) {
          console.error("Error al eliminar el partido", error);
          setAlerta({
            mensaje: "Error al eliminar el partido!",
            tipo: "success",
          });
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
          Swal.fire("Error", "No se pudo eliminar el partido.", "error");
        }
      }
    });
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
        <div
          className={`alert alert-${alerta.tipo} alert-dismissible fade show`}
          role="alert"
        >
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

      <h1 className="text-left">Registro de Partidos</h1>
      

      <form onSubmit={store} className="mt-2 mb-4">
  <div className="row">
    {/* Selecciona un Torneo */}
    <div className="col-6 col-md-6 mb-3">
      <label htmlFor="torneo_id">Selecciona un Torneo:</label>
      <select
        id="torneo_id"
        className="form-control"
        value={torneoId}
        required
        onChange={(e) => setTorneoId(e.target.value)}
      >
        <option value="" disabled>
          Selecciona un torneo
        </option>
        {torneos.map((torneo) => (
          <option key={torneo.id} value={torneo.id}>
            {torneo.nombre}
          </option>
        ))}
      </select>
    </div>

    {/* Selecciona Categoría */}
    <div className="col-6 col-md-6 mb-3">
      <label htmlFor="categoria_id">Selecciona Categoría:</label>
      <select
        required
        id="categoria_id"
        className="form-control"
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value)}
        disabled={!torneoId}
      >
        <option value="" disabled>
          Selecciona una categoría
        </option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>
    </div>

    {/* Selecciona Subcategoría */}
    <div className="col-6 col-md-6 mb-3">
      <label htmlFor="subcategoria_id">Selecciona Subcategoría:</label>
      <select
        required
        id="subcategoria_id"
        className="form-control"
        value={subcategoriaId}
        onChange={(e) => setSubcategoriaId(e.target.value)}
        disabled={!categoriaId}
      >
        <option value="" disabled>
          Selecciona una Subcategoría
        </option>
        {subcategorias.map((subcategoria) => (
          <option key={subcategoria.id} value={subcategoria.id}>
            {subcategoria.nombre}
          </option>
        ))}
      </select>
    </div>

    {/* Selecciona Grupo */}
    <div className="col-6 col-md-6 mb-3">
      <label htmlFor="grupo_id">Selecciona Grupo:</label>
      <select
        required
        id="grupo_id"
        className="form-control"
        value={grupoId}
        onChange={(e) => setGrupoId(e.target.value)}
        disabled={!subcategoriaId}
      >
        <option value="" disabled>
          Seleccione un grupo
        </option>
        {grupos.map((grupo) => (
          <option key={grupo.id} value={grupo.id}>
            {grupo.nombre}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Datos de Equipos y Marcadores */}
  <div className="row">
    {/* Equipo Local */}
    <div className="col-6 col-md-4 mb-3">
      <label htmlFor="equipo_local" className="form-label">
        Equipo Local
      </label>
      <select
        required
        id="equipo_local"
        name="equipo_local"
        className="form-control"
        onChange={(e) => setEquipoLocal(e.target.value)}
        value={equipoLocalID}
      >
        <option value="" disabled>
          Selecciona un Equipo
        </option>
        {equipos.map((equipo) => (
          <option key={equipo.id} value={equipo.id}>
            {equipo.nombre}
          </option>
        ))}
      </select>
    </div>

    {/* Marcador Local */}
    <div className="col-6 col-md-2 mb-3">
      <label htmlFor="marcador1">Marcador</label>
      <input
        id="marcador1"
        name="marcador1"
        type="number"
        min={0}
        max={50}
        placeholder="Local Ej: 5"
        className="form-control"
        onChange={(e) => setMarcador1(e.target.value)}
        value={marcador1}
      />
    </div>

    {/* Marcador Visitante */}
    <div className="col-6 col-md-2 mb-3">
      <label htmlFor="marcador2">Marcador</label>
      <input
        id="marcador2"
        name="marcador2"
        type="number"
        min={0}
        max={50}
        placeholder="Visitante Ej: 1"
        className="form-control"
        onChange={(e) => setMarcador2(e.target.value)}
        value={marcador2}
      />
    </div>
    {/* Equipo Visitante */}
    <div className="col-6 col-md-4 mb-3">
      <label htmlFor="equipo_Visitante" className="form-label">
        Equipo Visitante
      </label>
      <select
        required
        id="equipo_Visitante"
        name="equipo_Visitante"
        className="form-control"
        onChange={(e) => setEquipoVisitante(e.target.value)}
        value={equipoVisitanteID}
      >
        <option value="" disabled>
          Selecciona un Equipo
        </option>
        {equipos.map((equipo) => (
          <option key={equipo.id} value={equipo.id}>
            {equipo.nombre}
          </option>
        ))}
      </select>
    </div>
  </div>


  {/* Fecha y Hora */}
  <div className="row">
    <div className="col-6 col-md-2 mb-3">
      <label htmlFor="fecha">Fecha</label>
      <input
        id="fecha"
        name="fecha"
        type="date"
        className="form-control"
        onChange={(e) => setFecha(e.target.value)}
        value={fecha}
      />
    </div>
    <div className="col-6 col-md-2 mb-3">
      <label htmlFor="hora">Hora</label>
      <input
        id="hora"
        name="hora"
        type="time"
        className="form-control"
        onChange={(e) => setHora(e.target.value)}
        value={hora}
      />
    </div>
  </div>

  {/* Botón de Envío */}
  <div className="row">
    <div className="col-12 mt-3">
      <button className="btn btn-outline-primary " type="submit">
        Registrar Partido
      </button>
    </div>
  </div>
</form>



      
      {/* Table of Matches */}
     <div className="scroll-container">
    <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th className="text-center">Fecha</th>
              <th className="text-center">Local</th>
              <th className="text-center">marcador</th>
              <th className="text-center">Visitante</th>
              <th className="text-center">Hora</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidos.map((partido) => (
              <tr key={partido.id}>
 <td className="text-center">
                  {partido.fecha}
                </td>
                <td className="text-left">
                  
                  {/* <img
                           src={${Images}/${partido.equipo_a.archivo}} 
                           className="logo2"
                           alt={partido.equipo_a.nombre}
                         /> */}
                  {partido.equipo_a.nombre}
                </td>
                <td className="text-center">
                  {partido.marcador1} - {partido.marcador2}
                </td>
                <td className="text-right">
                  {partido.equipo_b.nombre}

                  {/* <img
                           src={${Images}/${partido.equipo_b.archivo}} 
                           className="logo2"
                           alt={partido.equipo_a.nombre}
                         /> */}
                </td>
               
                <td className="text-center">
                   {partido.hora?.slice(0, 5)}
                </td>
                <td className="text-center d-flex justify-content-evenly">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditClick(partido)}
                  >
                    <CreateIcon />
                  </button>
                  <div>
                    <button
                      className="btn btn-danger far fa-trash-alt delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        deletePartidos(partido.id);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </button>{" "}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ModalEditMatches
          showModal={showModal}
          onClose={handleCloseModal}
          matchData={selectedPartido} // Pasa los datos del partido al modal
          API_ENDPOINT={API_ENDPOINT} // Pasa el endpoint API
          onSave={savePartido} // Función para guardar el partido
        />
      </div>
      <div className="pagination mb-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-disabled={currentPage === 1}
         
        >
          ← Anterior
        </button>
        <span className="mx-2">{`Página ${currentPage} de ${lastPage}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          aria-disabled={currentPage === lastPage}
         
        >
          Siguiente →
        </button>
      </div>
    </div>
      )}
      </>
  );
};

export default FORM_Matches;
