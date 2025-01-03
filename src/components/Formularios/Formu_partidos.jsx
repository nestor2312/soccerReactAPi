import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import ModalEditMatches from "../Formularios-edit/ModalEditMatches";

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
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [marcador1, setMarcador1] = useState("");
  const [marcador2, setMarcador2] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");
  const [equipoVisitanteID, setEquipoVisitante] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const handleEditClick = (partido) => {
    setSelectedPartido(partido); // Asignar los datos del partido al estado
    setShowModal(true); // Mostrar el modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartido(null); // Limpiar los datos del partido
  };

  const savePartido = async (updatedPartido) => {
    try {
      console.log("Datos enviados al backend:", updatedPartido);
      // Actualizar partido en el backend
      await axios.put(
        `${API_ENDPOINT}partido/${updatedPartido.id}`,
        updatedPartido
      );

      // Actualizar localmente el estado de partidos

      // Mostrar alerta de éxito
      setAlerta({
        mensaje: "¡Partido actualizado correctamente!",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    } catch (error) {
      // Manejar errores
      console.error("Error al actualizar el partido:", error);
      setAlerta({
        mensaje: "¡Error al actualizar el partido!",
        tipo: "danger",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    }
  };

  useEffect(() => {
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
      const response = await axios.get(`${API_ENDPOINT}partidos`);
      setPartidos(response.data);
    } catch (error) {
      console.error("Error al cargar los partidos:", error);
    }
  };

  const store = async (e) => {
    e.preventDefault();

    if (equipoLocalID === equipoVisitanteID) {
      alert("Los equipos no pueden ser el mismo.");
      return;
    }
    if (!marcador1 || !marcador2) {
      alert("Por favor, ingrese los marcadores.");
      return;
    }

    const formData = new FormData();
    formData.append("marcador1", marcador1);
    formData.append("marcador2", marcador2);
    formData.append("equipoA_id", equipoLocalID);
    formData.append("equipoB_id", equipoVisitanteID);

    try {
      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlerta({
        mensaje: "¡Partido Registrado correctamente!",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      fetchPartidos();
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  };

  useEffect(() => {
    fetchPartidos();
  }, []);

  // Eliminar partido
  const deletePartidos = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este partido?")) {
      try {
        await axios.delete(`${API_ENDPOINT}partido/${id}`);
        // Actualizar lista de partidos
        setAlerta({
          mensaje: "¡Partido eliminado correctamente!",
          tipo: "success",
        });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
        const response = await axios.get(`${API_ENDPOINT}partidos`);
        setPartidos(response.data);
      } catch (error) {
        setAlerta({
          mensaje: "¡Error al eliminar el partido!",
          tipo: "success",
        });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
        console.error("Error al eliminar el partido:", error);
      }
    }
  };

  return (
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
      <form onSubmit={store}>
        {/* Form Fields */}
        <div>
          <div className="form-group">
            <label htmlFor="torneo_id">Selecciona un Torneo:</label>
            <select
              id="torneo_id"
              className="form-control"
              value={torneoId}
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

          <div className="form-group">
            <label htmlFor="torneo_id">Selecciona Categoría:</label>
            <select
              id="torneo_id"
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

          <div className="form-group">
            <label htmlFor="torneo_id">Selecciona Subcategoría:</label>
            <select
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

          <div className="form-group">
            <label htmlFor="torneo_id">Selecciona Grupo:</label>
            <select
              id="torneo_id"
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

          <div className="row">
            <div className="input-field col-4 s12 m6">
              <label htmlFor="equipo_local" className="form-label">
                Selecciona Equipo Local
              </label>
              <select
                id="equipo_local"
                name="equipo_local"
                className="form-control validate required"
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
            <div className="input-field col-2 s12 m6">
              <label>marcador</label>
              <input
                id="icon_prefix"
                name="marcador1"
                type="number"
                placeholder="marcador Local"
                className="form-control validate required light-blue-text"
                onChange={(e) => setMarcador1(e.target.value)}
                value={marcador1}
              />
            </div>
            <div className="input-field col-2 s12 m6">
              <label>marcador</label>
              <input
                id="icon_prefix"
                name="marcador1"
                type="number"
                placeholder="marcador Local"
                className="form-control validate required light-blue-text"
                onChange={(e) => setMarcador2(e.target.value)}
                value={marcador2}
              />
            </div>

            <div className="input-field col-4 s12 m6">
              <label htmlFor="equipo_local" className="form-label">
                Selecciona Equipo Visitante
              </label>
              <select
                id="equipo_Visitante"
                name="equipo_Visitante"
                className="form-control validate required"
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
        </div>
        <div className="col s12 m12 mt-3">
          <button className="btn btn-outline-info" type="submit">
            Registrar partido
          </button>
        </div>
      </form>
      {/* Table of Matches */}
      <div className="table-responsive card my-2">
        <table className="table ">
          <thead className="thead-light">
            <tr>
              <th className="text-center">Local</th>
              <th className="text-center">marcador</th>
              <th className="text-center">Visitante</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidos.map((partido) => (
              <tr key={partido.id}>
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
                <td className="text-center d-flex justify-content-around">
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEditClick(partido)}
                  >
                    Editar
                  </button>
                  <div>
                    <button
                      className="btn btn-danger far fa-trash-alt delete-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        deletePartidos(partido.id);
                      }}
                    >
                      Borrar
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
    </div>
  );
};

export default FORM_Matches;
