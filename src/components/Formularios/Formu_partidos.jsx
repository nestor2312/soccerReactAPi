import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import ModalEditMatches from "../Formularios-edit/ModalEditMatches";
import MatchEventsModal from "./MatchEventsModal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import Swal from "sweetalert2";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";

const endpoint = `${API_ENDPOINT}partido`;

const FORM_Matches = () => {
  // Estados de datos
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [partidos, setPartidos] = useState([]);

  // Estados de selección del formulario de registro manual
  const [torneoId, setTorneoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [grupoId, setGrupoId] = useState("");

  // Campos del partido manual
  const [marcador1, setMarcador1] = useState("");
  const [marcador2, setMarcador2] = useState("");
  const [fecha, setFecha] = useState("");
  const [jornada, setjornada] = useState("");
  const [sede, setsede] = useState("");
  const [hora, setHora] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");
  const [equipoVisitanteID, setEquipoVisitante] = useState("");

  // Estados de interfaz y feedback
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  // Modales de edición y eventos
  const [selectedPartido, setSelectedPartido] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Estados para opciones y valores del FILTRO
  const [categoriasFiltro, setCategoriasFiltro] = useState([]);
  const [subcategoriasFiltro, setSubcategoriasFiltro] = useState([]);
  const [filtroTorneo, setFiltroTorneo] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
  const [filtroJornada, setFiltroJornada] = useState("");

  // Estado de parámetros de búsqueda enviados al servidor
  const [paramsBusqueda, setParamsBusqueda] = useState({
    torneo_id: "",
    categoria_id: "",
    subcategoria_id: "",
    jornada: "",
    sede: "",
  });

  // Estados de Fixture Automático
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [fixturePrevia, setFixturePrevia] = useState([]);
  const [esIdaYVuelta, setEsIdaYVuelta] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // --- LÓGICA DE FIXTURE ---
  const generarRoundRobin = (listaEquipos) => {
    let teams = [...listaEquipos];
    if (teams.length % 2 !== 0) {
      teams.push({ id: null, nombre: "DESCANSA" });
    }

    const n = teams.length;
    const jornadas = n - 1;
    let fixture = [];

    for (let i = 0; i < jornadas; i++) {
      for (let j = 0; j < n / 2; j++) {
        const local = teams[j];
        const visitante = teams[n - 1 - j];

        if (local.id !== null && visitante.id !== null) {
          fixture.push({
            jornada: `Fecha ${i + 1}`,
            equipoA_id: local.id,
            equipoB_id: visitante.id,
            nombreA: local.nombre,
            nombreB: visitante.nombre,
          });
        }
      }
      teams.splice(1, 0, teams.pop());
    }
    return fixture;
  };

  const generarVuelta = (fixture, totalJornadas) => {
    return fixture.map((p) => {
      const numero = Number(p.jornada.replace("Fecha ", ""));

      return {
        ...p,
        jornada: `Fecha ${numero + totalJornadas}`,
        equipoA_id: p.equipoB_id,
        equipoB_id: p.equipoA_id,
        nombreA: p.nombreB,
        nombreB: p.nombreA,
      };
    });
  };

  const generarFixtureCompleto = (equiposList, idaYVuelta) => {
    let ida = generarRoundRobin(equiposList);
    if (!idaYVuelta) return ida;

    const totalJornadas = new Set(ida.map((p) => p.jornada)).size;
    const vuelta = generarVuelta(ida, totalJornadas);

    return [...ida, ...vuelta];
  };

  const esPartidoDuplicado = (fixture, indexActual, equipoA, equipoB, jornadaActual) => {
    return fixture.some((p, i) => {
      if (i === indexActual) return false;
      if (p.jornada !== jornadaActual) return false;

      const mismoOrden =
        Number(p.equipoA_id) === Number(equipoA) &&
        Number(p.equipoB_id) === Number(equipoB);

      const invertido =
        Number(p.equipoA_id) === Number(equipoB) &&
        Number(p.equipoB_id) === Number(equipoA);

      return mismoOrden || invertido;
    });
  };

  const handleInvertir = (index) => {
    setFixturePrevia((prev) => {
      const nuevoFixture = [...prev];
      const partido = { ...nuevoFixture[index] };

      if (esPartidoDuplicado(prev, index, partido.equipoB_id, partido.equipoA_id, partido.jornada)) {
        Swal.fire("Error", "Este cruce ya existe en esta jornada", "error");
        return prev;
      }

      [partido.equipoA_id, partido.equipoB_id] = [partido.equipoB_id, partido.equipoA_id];
      [partido.nombreA, partido.nombreB] = [partido.nombreB, partido.nombreA];

      nuevoFixture[index] = partido;
      return nuevoFixture;
    });
  };

  const handleCambiarEquipo = (index, posicion, nuevoId) => {
    const idNumerico = Number(nuevoId);
    const nuevoEquipo = equipos.find((e) => Number(e.id) === idNumerico);
    if (!nuevoEquipo) return;

    setFixturePrevia((prev) => {
      const nuevoFixture = [...prev];
      const partido = { ...nuevoFixture[index] };

      let equipoA = posicion === "A" ? idNumerico : partido.equipoA_id;
      let equipoB = posicion === "B" ? idNumerico : partido.equipoB_id;

      if (Number(equipoA) === Number(equipoB)) {
        Swal.fire("Aviso", "Un equipo no puede jugar contra sí mismo", "warning");
        return prev;
      }

      if (esPartidoDuplicado(prev, index, equipoA, equipoB, partido.jornada)) {
        Swal.fire("Error", "Este equipo ya tiene un partido asignado en esta jornada", "error");
        return prev;
      }

      if (posicion === "A") {
        partido.equipoA_id = nuevoEquipo.id;
        partido.nombreA = nuevoEquipo.nombre;
      } else {
        partido.equipoB_id = nuevoEquipo.id;
        partido.nombreB = nuevoEquipo.nombre;
      }

      nuevoFixture[index] = partido;
      return nuevoFixture;
    });
  };

  const validarFixture = () => {
    const errores = [];
    const partidosVistos = new Set();

    for (let i = 0; i < fixturePrevia.length; i++) {
      const p = fixturePrevia[i];
      const equipoA = Number(p.equipoA_id);
      const equipoB = Number(p.equipoB_id);

      if (equipoA === equipoB) {
        errores.push(`❌ ${p.nombreA} no puede jugar contra sí mismo en la ${p.jornada}`);
        continue;
      }

      const clave = esIdaYVuelta
        ? `${p.jornada}-${equipoA}-${equipoB}`
        : `${p.jornada}-${[equipoA, equipoB].sort().join("-")}`;

      if (partidosVistos.has(clave)) {
        errores.push(`❌ Partido duplicado en ${p.jornada}: ${p.nombreA} vs ${p.nombreB}`);
      } else {
        partidosVistos.add(clave);
      }
    }

    if (errores.length > 0) {
      Swal.fire({
        title: "Errores en el fixture",
        html: errores.join("<br>"),
        icon: "error",
      });
      return false;
    }

    return true;
  };

  const confirmarGuardadoFixture = async () => {
    if (!validarFixture()) return;

    setShowPreviewModal(false);
    setIsLoading(true);

    try {
      for (const p of fixturePrevia) {
        const formData = new FormData();
        formData.append("equipoA_id", p.equipoA_id);
        formData.append("equipoB_id", p.equipoB_id);
        formData.append("jornada", p.jornada);

        await axios.post(endpoint, formData);
      }

      Swal.fire("¡Éxito!", "Se han generado todos los partidos correctamente", "success");
      fetchPartidos();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Hubo un problema al guardar algunos partidos", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- EFECTOS Y PETICIONES ---
  useEffect(() => {
    document.title = "Admin - Partidos";
  }, []);

  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}torneos`);
        setTorneos(response.data);
      } catch (err) {
        console.error("Error al cargar los torneos:", err);
      }
    };
    fetchTorneos();
  }, []);

  // Carga cascada de selects para registro manual
  useEffect(() => {
    if (torneoId) {
      axios
        .get(`${API_ENDPOINT}categorias/${torneoId}`)
        .then((res) => {
          setCategorias(res.data);
          setSubcategorias([]);
          setGrupos([]);
          setCategoriaId("");
          setSubcategoriaId("");
          setGrupoId("");
        })
        .catch((err) => console.error("Error al cargar categorías:", err));
    } else {
      setCategorias([]);
    }
  }, [torneoId]);

  useEffect(() => {
    if (categoriaId) {
      axios
        .get(`${API_ENDPOINT}categoria/${categoriaId}/subcategorias`)
        .then((res) => {
          setSubcategorias(res.data);
          setGrupos([]);
          setSubcategoriaId("");
          setGrupoId("");
        })
        .catch((err) => console.error("Error al cargar subcategorías:", err));
    } else {
      setSubcategorias([]);
    }
  }, [categoriaId]);

  useEffect(() => {
    if (subcategoriaId) {
      axios
        .get(`${API_ENDPOINT}grupos/${subcategoriaId}`)
        .then((res) => {
          setGrupos(res.data);
          setGrupoId("");
        })
        .catch((err) => console.error("Error al cargar grupos:", err));
    } else {
      setGrupos([]);
    }
  }, [subcategoriaId]);

  useEffect(() => {
    if (grupoId) {
      axios
        .get(`${API_ENDPOINT}equipos/${grupoId}`)
        .then((res) => setEquipos(res.data))
        .catch((err) => console.error("Error al cargar equipos:", err));
    } else {
      setEquipos([]);
    }
  }, [grupoId]);

  // Filtros dinámicos
  useEffect(() => {
    if (filtroTorneo) {
      axios
        .get(`${API_ENDPOINT}categorias/${filtroTorneo}`)
        .then((res) => setCategoriasFiltro(res.data))
        .catch((err) => console.error(err));
    } else {
      setCategoriasFiltro([]);
      setFiltroCategoria("");
    }
  }, [filtroTorneo]);

  useEffect(() => {
    if (filtroCategoria) {
      axios
        .get(`${API_ENDPOINT}categoria/${filtroCategoria}/subcategorias`)
        .then((res) => setSubcategoriasFiltro(res.data))
        .catch((err) => console.error(err));
    } else {
      setSubcategoriasFiltro([]);
      setFiltroSubcategoria("");
    }
  }, [filtroCategoria]);

  // Consulta principal de Partidos
  const fetchPartidos = async () => {
    try {
      setIsLoading(true);

      const params = { page: currentPage };
      if (paramsBusqueda.torneo_id) params.torneo_id = paramsBusqueda.torneo_id;
      if (paramsBusqueda.categoria_id) params.categoria_id = paramsBusqueda.categoria_id;
      if (paramsBusqueda.subcategoria_id) params.subcategoria_id = paramsBusqueda.subcategoria_id;
      if (paramsBusqueda.jornada) params.jornada = paramsBusqueda.jornada;

      const response = await axios.get(`${API_ENDPOINT}partidos`, { params });

      if (response.data && response.data.data) {
        setPartidos(response.data.data);
        setLastPage(response.data.last_page || 1);
      } else if (Array.isArray(response.data)) {
        setPartidos(response.data);
        setLastPage(1);
      } else {
        setPartidos([]);
      }
    } catch (err) {
      console.error("Error al cargar los partidos:", err);
      setPartidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartidos();
  }, [currentPage, paramsBusqueda]);

  // Manejo de Filtros
  const handleFiltrar = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setParamsBusqueda({
      torneo_id: filtroTorneo,
      categoria_id: filtroCategoria,
      subcategoria_id: filtroSubcategoria,
      jornada: filtroJornada,
      sede: "",
    });
  };

  const limpiarFiltros = () => {
    setFiltroTorneo("");
    setFiltroCategoria("");
    setFiltroSubcategoria("");
    setFiltroJornada("");
    setParamsBusqueda({ torneo_id: "", categoria_id: "", subcategoria_id: "", jornada: "", sede: "" });
    setCurrentPage(1);
  };

  // Guardar Partido Manual
  const store = async (e) => {
    e.preventDefault();

    if (equipoLocalID === equipoVisitanteID) {
      Swal.fire({
        title: "¡Los equipos no pueden ser el mismo!",
        text: "Seleccione 2 equipos diferentes para registrar el partido",
        icon: "warning",
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
    formData.append("jornada", jornada);
    formData.append("sede", sede);

    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAlerta({ mensaje: "¡Partido registrado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 2500);

      // Limpiar campos del formulario
      setMarcador1("");
      setMarcador2("");
      setEquipoLocal("");
      setEquipoVisitante("");
      setFecha("");
      setHora("");
      setjornada("");
      setsede("");

      fetchPartidos();
    } catch (err) {
      setAlerta({ mensaje: "¡Error al registrar el partido!", tipo: "danger" });
      console.error("Error al enviar los datos:", err);
    }
  };

  // Editar y Eliminar
  const handleEditClick = async (partido) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}partidos/${partido.id}`);
      const data = response.data;
      const eqA = data.equipo_a || data.equipoA;

      const mappedPartido = {
        id: data.id,
        torneoId: eqA?.grupo?.subcategoria?.categoria?.torneo?.id || "",
        categoriaId: eqA?.grupo?.subcategoria?.categoria?.id || "",
        subcategoriaId: eqA?.grupo?.subcategoria?.id || "",
        grupoId: eqA?.grupo?.id || "",
        equipoA_id: eqA?.id || "",
        equipoB_id: (data.equipo_b || data.equipoB)?.id || "",
        marcador1: data.marcador1,
        marcador2: data.marcador2,
        fecha: data.fecha,
        hora: data.hora,
        jornada: data.jornada,
        sede: data.sede,
      };

      setSelectedPartido(mappedPartido);
      setShowModal(true);
    } catch (err) {
      console.error("Error al cargar datos del partido:", err);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartido(null);
  };

  const savePartido = async (updatedPartido) => {
    try {
      await axios.put(`${API_ENDPOINT}partido/${updatedPartido.id}`, updatedPartido);
      fetchPartidos();
      setAlerta({ mensaje: "¡Partido actualizado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 2000);
    } catch (err) {
      console.error("Error al actualizar el partido:", err);
      setAlerta({ mensaje: "¡Error al actualizar el partido!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 4000);
    }
  };

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
          setPartidos((prev) => prev.filter((p) => p.id !== id));
          setAlerta({ mensaje: "Partido eliminado correctamente!", tipo: "success" });
          fetchPartidos();
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 2000);
        } catch (err) {
          console.error("Error al eliminar el partido", err);
          Swal.fire("Error", "No se pudo eliminar el partido.", "error");
        }
      }
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {isLoading ? (
        <div className="loading-container py-5 text-center">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container py-5 text-center">
          <ErrorCarga />
        </div>
      ) : (
        <div className="container mt-3">
          {alerta.mensaje && (
            <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
              {alerta.mensaje}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setAlerta({ mensaje: "", tipo: "" })}
              ></button>
            </div>
          )}

          <h1 className="text-left mb-3">Registro de Partidos</h1>

          {/* Formulario de Registro Manual */}
          <form onSubmit={store} className="mt-2 mb-4">
            <div className="row">
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

            {/* Equipos y Marcadores */}
            <div className="row">
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

            <div className="row">
              <div className="col-6 col-md-2 mb-3">
                <label htmlFor="jornada">Jornada</label>
                <input
                  id="jornada"
                  name="jornada"
                  type="text"
                  placeholder="Ej: Fecha 1 (Opcional)"
                  className="form-control"
                  onChange={(e) => setjornada(e.target.value)}
                  value={jornada}
                />
              </div>

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

              <div className="col-6 col-md-2 mb-3">
                <label htmlFor="sede">Sede</label>
                <input
                  id="sede"
                  name="sede"
                  type="text"
                  placeholder="Ej: Cancha 1"
                  className="form-control"
                  onChange={(e) => setsede(e.target.value)}
                  value={sede}
                />
              </div>
            </div>

            {/* Acciones del formulario */}
            <div className="col-12 mt-3 d-flex flex-wrap gap-2 align-items-center">
              <button className="btn btn-outline-primary" type="submit">
                Registrar Partido
              </button>
              <button
                type="button"
                className="btn text-white"
                style={{ backgroundColor: "#6f42c1" }}
                onClick={() => {
                  if (equipos.length < 2) {
                    return Swal.fire("Error", "Necesitas al menos 2 equipos en el grupo", "error");
                  }
                  const fixture = generarFixtureCompleto(equipos, esIdaYVuelta);
                  setFixturePrevia(fixture);
                  setShowPreviewModal(true);
                }}
                disabled={!grupoId}
              >
                Generar Fixture Automático
              </button>
              <div className="form-check form-switch mt-2 custom-switch-container ms-2">
                <input
                  className="form-check-input custom-switch-input"
                  type="checkbox"
                  id="idaVueltaSwitch"
                  checked={esIdaYVuelta}
                  onChange={(e) => setEsIdaYVuelta(e.target.checked)}
                />
                <label className="form-check-label small fw-bold ms-1" htmlFor="idaVueltaSwitch">
                  ¿Ida y Vuelta?
                </label>
              </div>
            </div>
          </form>

          {/* Panel de Filtros */}
          <div className="card p-4 mb-4 shadow-sm bg-light">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Filtrar por Partidos</h5>
              <button className="btn btn-sm btn-outline-secondary" onClick={limpiarFiltros}>
                Limpiar Filtros
              </button>
            </div>

            <form onSubmit={handleFiltrar}>
              <div className="row g-2">
                <div className="col-md-3">
                  <label className="small fw-bold">Torneo</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtroTorneo}
                    onChange={(e) => setFiltroTorneo(e.target.value)}
                  >
                    <option value="">Todos</option>
                    {torneos.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="small fw-bold">Categoría</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtroCategoria}
                    onChange={(e) => setFiltroCategoria(e.target.value)}
                    disabled={!filtroTorneo}
                  >
                    <option value="">Todas</option>
                    {categoriasFiltro.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="small fw-bold">Subcategoría</label>
                  <select
                    className="form-select form-select-sm"
                    value={filtroSubcategoria}
                    onChange={(e) => setFiltroSubcategoria(e.target.value)}
                    disabled={!filtroCategoria}
                  >
                    <option value="">Todas</option>
                    {subcategoriasFiltro.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="small fw-bold">Jornada</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Ej: Fecha 1"
                    value={filtroJornada}
                    onChange={(e) => setFiltroJornada(e.target.value)}
                  />
                </div>

                <div className="col-md-2 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary btn-sm w-100 fw-bold">
                    Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Tabla de Partidos */}
          <div className="scroll-container">
            <div className="d-flex justify-content-center align-items-center mb-2 mt-2">
              <h6 className="fw-bold badge bg-secondary">
                {paramsBusqueda.jornada
                  ? `Mostrando: ${paramsBusqueda.jornada}`
                  : "Todos los partidos registrados"}
              </h6>
            </div>
            <table className="table table-striped table-hover align-middle">
              <thead className="thead-light">
                <tr>
                  <th className="text-center">Jornada</th>
                  <th className="text-center">Sede</th>
                  <th className="text-center">Fecha</th>
                  <th className="text-start">Local</th>
                  <th className="text-center">Marcador</th>
                  <th className="text-end">Visitante</th>
                  <th className="text-center">Hora</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {partidos && partidos.length > 0 ? (
                  partidos.map((partido) => {
                    const eqA = partido.equipo_a || partido.equipoA;
                    const eqB = partido.equipo_b || partido.equipoB;

                    return (
                      <tr key={partido.id}>
                        <td className="text-center">{partido.jornada || "-"}</td>
                        <td className="text-center">{partido.sede || "-"}</td>
                        <td className="text-center">{partido.fecha || "-"}</td>
                        <td className="text-start fw-bold">{eqA?.nombre || "Sin asignar"}</td>
                        <td className="text-center">
                          <span className="badge bg-primary fs-6">
                            {partido.marcador1 ?? 0} - {partido.marcador2 ?? 0}
                          </span>
                        </td>
                        <td className="text-end fw-bold">{eqB?.nombre || "Sin asignar"}</td>
                        <td className="text-center">
                          {partido.hora ? partido.hora.slice(0, 5) : "-"}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEditClick(partido)}
                            >
                              <CreateIcon fontSize="small" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-info btn-sm text-white"
                              onClick={() => {
                                setSelectedMatch(partido.id);
                                setShowEventsModal(true);
                              }}
                            >
                              Detalles
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                deletePartidos(partido.id);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No se encontraron partidos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Modal de Edición */}
            <ModalEditMatches
              showModal={showModal}
              onClose={handleCloseModal}
              matchData={selectedPartido}
              API_ENDPOINT={API_ENDPOINT}
              onSave={savePartido}
            />

            {/* Modal de Eventos */}
            <MatchEventsModal
              showModal={showEventsModal}
              partidoId={selectedMatch}
              API_ENDPOINT={API_ENDPOINT}
              onClose={() => {
                setShowEventsModal(false);
                setSelectedMatch(null);
              }}
            />
          </div>

          {/* Paginación */}
          {lastPage > 1 && (
            <div className="pagination d-flex justify-content-center align-items-center my-4 gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span className="mx-2">{`Página ${currentPage} de ${lastPage}`}</span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Modal de Previsualización y Edición de Fixture */}
          {showPreviewModal && (
            <div
              className="modal d-block fade show"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header bg-purple text-white">
                    <h5 className="modal-title">
                      Previsualización del Fixture ({fixturePrevia.length} partidos)
                    </h5>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setShowPreviewModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="table-responsive">
                      <table className="table table-sm table-hover align-middle">
                        <thead className="table-dark">
                          <tr>
                            <th>Jornada</th>
                            <th>Equipo Local (A)</th>
                            <th className="text-center">VS</th>
                            <th>Equipo Visitante (B)</th>
                            <th className="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fixturePrevia.map((p, idx) => (
                            <tr key={idx}>
                              <td className="fw-bold">{p.jornada}</td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={p.equipoA_id}
                                  onChange={(e) =>
                                    handleCambiarEquipo(idx, "A", e.target.value)
                                  }
                                >
                                  {equipos.map((e) => (
                                    <option key={e.id} value={e.id}>
                                      {e.nombre}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="text-center fw-bold text-muted">vs</td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={p.equipoB_id}
                                  onChange={(e) =>
                                    handleCambiarEquipo(idx, "B", e.target.value)
                                  }
                                >
                                  {equipos.map((e) => (
                                    <option key={e.id} value={e.id}>
                                      {e.nombre}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handleInvertir(idx)}
                                >
                                  Invertir Localía
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPreviewModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={confirmarGuardadoFixture}
                    >
                      Confirmar y Guardar Fixture
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FORM_Matches;