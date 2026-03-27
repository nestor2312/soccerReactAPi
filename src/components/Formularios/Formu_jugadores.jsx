/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import "./index.css";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import ModalJugadores from "../Formularios-edit/ModalEditPlayers";
import card_red from "../../assets/red-card.png";
import card_yellow from "../../assets/yellow-card.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import Swal from "sweetalert2";

const endpoint = `${API_ENDPOINT}jugador`;
const InfoJugadores_endpoint = `${API_ENDPOINT}jugadores`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

const FORM_Players = () => {
  // ✅ Estados principales
// eslint-disable-next-line no-unused-vars
const [jugadores, ] = useState([]); // ✅ guarda todos los jugadores
const [jugadoresFiltrados, setJugadoresFiltrados] = useState([]); // ✅ guarda los filtrados

  const [subcategorias, setSubcategorias] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [equipoID, setEquipoID] = useState("");
const [totalGeneral, setTotalGeneral] = useState(0);
// --- ESTADOS PARA EL FILTRO (Buscador/Tabla) ---
const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
const [filtroEquipo, setFiltroEquipo] = useState("");
const [equiposFiltro, setEquiposFiltro] = useState([]);

  const [selectedJugador, setSelectedJugador] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [numero, setNumero] = useState("");
  const [card_amarilla, setCardAmarilla] = useState("");
  const [card_roja, setCardRoja] = useState("");
  const [goles, setGoles] = useState("");
  const [asistencias, setAsistencias] = useState("");

  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    document.title = "Admin - Jugadores";
  
  },[]);


  // 🔹 Obtener subcategorías
  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await axios.get(subcategoriasEndpoint);
        setSubcategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las subcategorías:", error);
      }
    };
    fetchSubcategorias();
  }, []);

  // 🔹 Obtener equipos según subcategoría
  useEffect(() => {
    const fetchEquipos = async () => {
      if (SubcategoriaID) {
        try {
          const response = await axios.get(`${API_ENDPOINT}subcategoria/${SubcategoriaID}/equipos`);
          setEquiposFiltrados(response.data);
        } catch (error) {
          console.error("Error al obtener los equipos:", error);
        }
      } else {
        setEquiposFiltrados([]);
      }
    };
    fetchEquipos();
  }, [SubcategoriaID]);

// 🔹 Obtener equipos para el BUSCADOR (independiente del registro)
useEffect(() => {
  const fetchEquiposFiltro = async () => {
    if (filtroSubcategoria) {
      try {
        const response = await axios.get(`${API_ENDPOINT}subcategoria/${filtroSubcategoria}/equipos`);
        setEquiposFiltro(response.data);
      } catch (error) {
        console.error("Error al obtener equipos para el filtro:", error);
      }
    } else {
      setEquiposFiltro([]);
      setFiltroEquipo(""); // Limpiar equipo si no hay subcategoría
    }
  };
  fetchEquiposFiltro();
}, [filtroSubcategoria]);

useEffect(() => {
  fetchJugadoresFiltrados();
}, [filtroSubcategoria, filtroEquipo, currentPage]);

// 🔹 Filtrar jugadores usando los nuevos estados de FILTRO
const fetchJugadoresFiltrados = async () => {
  try {
    setIsLoading(true);
    let url = "";
    
    if (!filtroSubcategoria && !filtroEquipo) {
      url = `${InfoJugadores_endpoint}?page=${currentPage}`;
    } else {
      url = `${API_ENDPOINT}subcategoria/${filtroSubcategoria}/jugadores?page=${currentPage}`;
    }

    const response = await axios.get(url);
    let data = response.data.data || response.data;
    
    if (filtroEquipo) {
      data = data.filter(j => j.equipo?.id === parseInt(filtroEquipo));
    }

    setJugadoresFiltrados(data);
    setLastPage(response.data.last_page || 1);
    setTotalGeneral(response.data.total || data.length);
    setIsLoading(false);
  } catch (error) {
    console.error("Error:", error);
    setIsLoading(false);
  }
};


  // 🔹 Paginación
  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      setCurrentPage(page);
    }
  };

  // 🔹 Eliminar jugador
  const deleteJugador = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este jugador después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
if (result.isConfirmed) {
        try {
          await axios.delete(`${endpoint}/${id}`);
          fetchJugadoresFiltrados();
          Swal.fire("Eliminado", "Jugador eliminado correctamente.", "success");
        } catch (error) {
          console.error("Error al eliminar jugador:", error);
          Swal.fire("Error", "No se pudo eliminar el jugador.", "error");
        }
      }
    });
  };

  // 🔹 Registrar jugador nuevo
  const store = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("equipo_id", equipoID);
      formData.append("nombre", nombre);
      formData.append("apellido", apellido);
      formData.append("edad", edad);
      formData.append("numero", numero);
      formData.append("card_amarilla", card_amarilla);
      formData.append("card_roja", card_roja);
      formData.append("goles", goles);
      formData.append("asistencias", asistencias);

      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlerta({ mensaje: "Jugador registrado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 4000);
      fetchJugadoresFiltrados(currentPage);

      // Limpiar formulario
      setNombre("");
      setApellido("");
      setEdad("");
      setNumero("");
      setCardAmarilla("");
      setCardRoja("");
      setGoles("");
      setAsistencias("");
    } catch (error) {
      console.error("Error al registrar jugador:", error);
      setAlerta({ mensaje: "Error al registrar jugador.", tipo: "danger" });
    }
  };

  // 🔹 Modal de edición
  const handleEditClick = async (jugador) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}jugadores/${jugador.id}`);
      setSelectedJugador(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error al obtener jugador:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJugador(null);
  };

  const saveJugador = async (updatedJugador) => {
    try {
      await axios.put(`${API_ENDPOINT}jugador/${updatedJugador.id}`, updatedJugador);
      fetchJugadoresFiltrados(currentPage);
      setAlerta({ mensaje: "Jugador actualizado correctamente!", tipo: "success" });
    } catch (error) {
      console.error("Error al actualizar jugador:", error);
      setAlerta({ mensaje: "Error al actualizar jugador!", tipo: "danger" });
    }
  };

  

  return (
    <>
      {isLoading ? (
        <div className="loading-container"><Cargando /></div>
      ) : error ? (
        <div className="loading-container"><ErrorCarga /></div>
      ) : (
        <div className="container mt-3">
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
  <h1 className="text-left">Registro de Jugadores</h1>
          
          <form onSubmit={store} className="mb-4">
            <div className="row">
              {/* Subcategoría */}
              <div className="col-md-6 mb-3">
                <label>Subcategoría:</label>
                <select className="form-control" value={SubcategoriaID} onChange={(e) => setSubcategoriaID(e.target.value)}>
                  <option value="">Seleccione una subcategoría</option>
                  {subcategorias.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.nombre} - {sub.categoria?.torneo?.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Equipo */}
              <div className="col-md-6 mb-3">
                <label>Equipo:</label>
                <select className="form-control" value={equipoID} onChange={(e) => setEquipoID(e.target.value)}>
                  <option value="">Seleccione un equipo</option>
                  {equiposFiltrados.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Campos del jugador */}
         {/* Campos del jugador */}
{[
  { id: "nombre", label: "Nombre", placeholder: "Ej: Juan", state: nombre, set: setNombre },
  { id: "apellido", label: "Apellido", placeholder: "Ej: Pérez", state: apellido, set: setApellido },
  { id: "edad", label: "Edad", placeholder: "Ej: 22", state: edad, set: setEdad, type: "number", min: 0 },
  { id: "numero", label: "Número", placeholder: "Ej: 10", state: numero, set: setNumero, type: "number", min: 0 },
  { id: "card_amarilla", label: "Amarillas", placeholder: "Ej: 2", state: card_amarilla, set: setCardAmarilla, type: "number", min: 0 },
  { id: "card_roja", label: "Rojas",  placeholder: "Ej: 1", state: card_roja, set: setCardRoja, type: "number", min: 0 },
  { id: "goles", label: "Goles", placeholder: "Ej: 5", state: goles, set: setGoles, type: "number", min: 0 },
  { id: "asistencias", label: "Asistencias", placeholder: "Ej: 3", state: asistencias, set: setAsistencias, type: "number", min: 0 },
].map(({ id, label, placeholder, state, set, type = "text", min }) => ( // <--- Agregamos min aquí
  <div key={id} className="col-md-3 mb-3">
    <label>{label}</label>
    <input 
      type={type} 
      className="form-control" 
      placeholder={placeholder} 
      value={state} 
      min={min} // <--- Atributo visual
      onChange={(e) => {
        const val = e.target.value;
        // Si es tipo número y tiene un mínimo, validamos que no sea menor
        if (type === "number" && min !== undefined && val !== "" && parseInt(val) < min) {
          set(min.toString()); // Forzamos al valor mínimo (ej: 0)
        } else {
          set(val);
        }
      }} 
    />
  </div>
))}
            </div>

            <button className="btn btn-outline-primary" type="submit">Registrar Jugador</button>
          </form>

          <h3>Lista de jugadores</h3>


          {/* 🔸 Filtros */}
          <div className="row mb-3">
            <div className="col-md-6">
              <label>Subcategoría:</label>
              <select className="form-control" value={filtroSubcategoria} onChange={(e) => {
        setFiltroSubcategoria(e.target.value);
        setFiltroEquipo(""); // Reiniciar equipo al cambiar subcategoría
        setCurrentPage(1);   // Volver a página 1
      }}>
                <option value="">Ver todas las subcategorías</option>
                {subcategorias.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre} - {sub.categoria?.torneo?.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Equipo:</label>
              <select className="form-control" value={filtroEquipo} onChange={(e) => {
        setFiltroEquipo(e.target.value);
        setCurrentPage(1);
      }}>
                 <option value="" disabled >Seleccione un equipo</option>
                <option value="">Ver todos los jugadores</option>
                {equiposFiltro.map((eq) => (
                  <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                ))}
              </select>
            </div>
          </div>

        <h6 className="text-left">
  {filtroSubcategoria || filtroEquipo ? "Resultados encontrados: " : "Total de jugadores registrados: "}
  <strong>{totalGeneral}</strong>
</h6>

          {/* 🔸 Tabla */}
          <div className="scroll-container">
    <table className="table table-striped">
          <thead className="thead-light">
                <tr>
                  <th>Equipo</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Edad</th>
                  <th>Número</th>
                  <th>Tarjetas <img src={card_yellow} width="20" alt="Amarilla" /></th>
                  <th>Tarjetas <img src={card_red} width="20" alt="Roja" /></th>
                  <th>Goles</th>
                  <th>Asistencias</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jugadoresFiltrados.length === 0 ? (
    <tr>
      <td colSpan="10" className="text-center text-muted">
        No hay jugadores registrados en el equipo.
      </td>
    </tr>
  ) : (
    jugadoresFiltrados.map((jug) => (
      <tr key={jug.id}>
        <td>{jug.equipo?.nombre}</td>
        <td>{jug.nombre}</td>
        <td>{jug.apellido}</td>
        <td>{jug.edad}</td>
        <td>{jug.numero}</td>
        <td>{jug.card_amarilla}</td>
        <td>{jug.card_roja}</td>
        <td>{jug.goles}</td>
        <td>{jug.asistencias}</td>
        <td className="d-flex justify-content-evenly">
          <button className="btn btn-warning" onClick={() => handleEditClick(jug)}>
            <CreateIcon />
          </button>
          <button className="btn btn-danger" onClick={() => deleteJugador(jug.id)}>
            <DeleteOutlineIcon />
          </button>
        </td>
      </tr>
    ))
  )}
              </tbody>
            </table>
          </div>

          {/* 🔸 Paginación */}
          <div className="pagination mb-4">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>← Anterior</button>
            <span>{`Página ${currentPage} de ${lastPage}`}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>Siguiente →</button>
          </div>

          <ModalJugadores
            showModal={showModal}
            onClose={handleCloseModal}
            PlayerData={selectedJugador}
            API_ENDPOINT={API_ENDPOINT}
            onSave={saveJugador}
          />
        </div>
      )}
    </>
  );
};

export default FORM_Players;
