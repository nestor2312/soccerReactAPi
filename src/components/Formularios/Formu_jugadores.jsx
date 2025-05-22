/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import "./index.css";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import ModalJugadores from "../Formularios-edit/ModalEditPlayers";
import card_red from "../../assets/yellow-card.png";
import card_yellow from "../../assets/red-card.png";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import Swal from "sweetalert2";

const endpoint = `${API_ENDPOINT}jugador`;

const InfoJugadores_endpoint = `${API_ENDPOINT}jugadores`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

const FORM_Players = () => {
  const [Jugadores, setJugadores] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [equipoID, setequipo] = useState("");
  const [nombre, setnombre] = useState("");
  const [apellido, setapellido] = useState("");
  const [edad, setedad] = useState("");
  const [numero, setnumero] = useState("");
  const [card_amarilla, setcard_amarilla] = useState("");
  const [goles, setgoles] = useState("");
  const [asistencias, setasistencias] = useState("");
  const [card_roja, setcard_roja] = useState("");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [selectedJugador, setSelectedJugador] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [error] = useState(null);
  const handleEditClick = (jugador) => {
    setSelectedJugador(jugador);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJugador(null);
  };

  const deleteJugadores = async (id) => {
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
          setJugadores(Jugadores.filter((Jugador) => Jugador.id !== id));
          setAlerta({ mensaje: "jugador eliminado correctamente!", tipo: "success" });
          ListaInfojugadores();
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        } catch (error) {
          console.error("Error al eliminar el jugador", error);
          setAlerta({ mensaje: "Error al eliminar el jugador!", tipo: "success" });
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
          Swal.fire("Error", "No se pudo eliminar el jugador.", "error");
        }
      }
    });
  };

  const saveJugador = async (updatedJugador) => {
    try {
      await axios.put(`${API_ENDPOINT}jugador/${updatedJugador.id}`, updatedJugador);
      ListaInfojugadores();
      setAlerta({ mensaje: "jugador actualizado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    } catch (error) {
      console.error("Error al actualizar jugador:", error);
      setAlerta({ mensaje: "Error al actualizar jugador!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };

  useEffect(() => {
    const fetchequipos = async () => {
      try {
      
        // No se usa el estado equipos en el formulario, solo se utiliza equiposFiltrados
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };
    fetchequipos();
    ListaInfojugadores();
  }, []);

  const ListaInfojugadores = async () => {
    try {
      const response = await axios.get(`${InfoJugadores_endpoint}?page=${currentPage}`);
      setJugadores(response.data.data);
      setLastPage(response.data.last_page);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };

  const store = async (e) => {
    e.preventDefault();
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
    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      ListaInfojugadores();
      setnombre("");
      setapellido("");
      setedad("");
      setnumero("");
      setcard_amarilla("");
      setcard_roja("");
      setgoles("");
      setasistencias("");
      setAlerta({ mensaje: "Jugador registrado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setAlerta({ mensaje: "Error al registrar el Jugador.", tipo: "danger" });
    }
  };

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

  useEffect(() => {
    const fetchEquiposPorSubcategoria = async () => {
      if (SubcategoriaID) {
        try {
          const response = await axios.get(`${API_ENDPOINT}subcategoria/${SubcategoriaID}/equipos`);
          setEquiposFiltrados(response.data);
        } catch (error) {
          console.error("Error al obtener los equipos por subcategoría:", error);
        }
      }
    };
    fetchEquiposPorSubcategoria();
  }, [SubcategoriaID]);

  useEffect(() => {
    ListaInfojugadores();
    setIsLoading(true);
    document.title = "Admin - Jugadores";
  }, [currentPage]);

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

      <h1 className="col-12 col-md-6 mb-3">Registro de Jugadores</h1>
      <div>
        <form className="container mt-2 mb-4" onSubmit={store} autoComplete="off">
          <div className="row">
            {/* Subcategoría */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="subcategoria_id">Selecciona una Subcategoría:</label>
              <select
                required
                id="subcategoria_id"
                className="form-control"
                value={SubcategoriaID}
                onChange={(e) => setSubcategoriaID(e.target.value)}
              >
                <option value="" disabled>
                  Selecciona una subcategoría
                </option>
                {subcategorias.map((subcategoria) => (
                  <option key={subcategoria.id} value={subcategoria.id}>
                    {subcategoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipo */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="equipo_nombre" className="form-label">
                Selecciona Equipo
              </label>
              <select
                required
                id="equipo_nombre"
                className="form-control"
                onChange={(e) => setequipo(e.target.value)}
                value={equipoID}
              >
                <option value="" disabled>
                  Selecciona un Equipo
                </option>
                {equiposFiltrados.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Campos de texto */}
            {[
              { id: "nombre", label: "Nombre", placeholder: "Ingrese el nombre del jugador", state: nombre, setState: setnombre },
              { id: "apellido", label: "Apellido", placeholder: "Ingrese el apellido del jugador", state: apellido, setState: setapellido },
              { id: "edad", label: "Edad", placeholder: "Ingrese la edad", type: "number", min: 0, max: 90, state: edad, setState: setedad },
              { id: "numero", label: "Número", placeholder: "Ingrese el número", type: "number", min: 1, max: 99, state: numero, setState: setnumero },
              { id: "card_amarilla", label: "Tarjetas amarillas", placeholder: "Ingrese cantidad", type: "number", min: 0, state: card_amarilla, setState: setcard_amarilla },
              { id: "card_roja", label: "Tarjetas rojas", placeholder: "Ingrese cantidad", type: "number", min: 0, state: card_roja, setState: setcard_roja },
              { id: "goles", label: "Goles", placeholder: "Ingrese cantidad", type: "number", min: 0, state: goles, setState: setgoles },
              { id: "asistencias", label: "Asistencias", placeholder: "Ingrese cantidad", type: "number", min: 0, state: asistencias, setState: setasistencias },
            ].map(({ id, label, placeholder, type = "text", min, max, state, setState }) => (
              <div key={id} className="col-12 col-md-6 mb-3">
                <label htmlFor={id} className="form-label">
                  {label}:
                </label>
                <input
                  required
                  id={id}
                  placeholder={placeholder}
                  name={id}
                  type={type}
                  min={min}
                  max={max}
                  className="form-control"
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                />
              </div>
            ))}

            <div className="col-12 text-left mt-3">
              <button className="btn btn-outline-primary " type="submit">
                Registrar Jugador
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="card my-2 col-12 col-sm-11 col-md-12">
        <div className="table-responsive responsive_table_admin">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th className="text-center">Equipo</th>
                <th className="text-center">Nombre</th>
                <th className="text-center">Apellido</th>
                <th className="text-center">Edad</th>
                <th className="text-center">Número</th>
                <th className="text-center card-icon">
                  Tarjeta{" "}
                  <span>
                    <img className="card_red" src={card_red} alt="Tarjeta Roja" />
                  </span>
                </th>
                <th className="text-center card-icon">
                  Tarjeta{" "}
                  <span>
                    <img className="card_red" src={card_yellow} alt="Tarjeta Amarilla" />
                  </span>
                </th>
                <th className="text-center">Goles</th>
                <th className="text-center">Asistencias</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Jugadores.map((jugador) => (
                <tr key={jugador.id}>
                  <td className="text-center">{jugador.equipo.nombre}</td>
                  <td className="text-center">{jugador.nombre}</td>
                  <td className="text-center">{jugador.apellido}</td>
                  <td className="text-center">{jugador.edad}</td>
                  <td className="text-center">{jugador.numero}</td>
                  <td className="text-center">{jugador.card_amarilla}</td>
                  <td className="text-center">{jugador.card_roja}</td>
                  <td className="text-center">{jugador.goles}</td>
                  <td className="text-center">{jugador.asistencias}</td>
                  <td className="text-center d-flex justify-content-evenly">
                    <button className="btn btn-warning" onClick={() => handleEditClick(jugador)}>
                      <CreateIcon />
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.preventDefault();
                        deleteJugadores(jugador.id);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ModalJugadores
            showModal={showModal}
            onClose={handleCloseModal}
            PlayerData={selectedJugador}
            API_ENDPOINT={API_ENDPOINT}
            onSave={saveJugador}
          />
        </div>
      </div>

      <div className="col-12 col-sm-12 col-md-12 pagination mb-4">
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

export default FORM_Players;
