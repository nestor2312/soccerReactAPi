/* eslint-disable no-unused-vars */
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import Alert from "../Alerta/Alerta";
import "./index.css";
import EditTeamModal from "../Formularios-edit/ModalEditTeams";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ErrorLogo from "../../assets/Vector.svg";
import Swal from "sweetalert2";

const FormTeams = () => {
  // Estados de formulario
  const [nombre, setNombre] = useState("");
  const [colorHover, setColorHover] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Estados de datos
  const [grupos, setGrupos] = useState([]);
  const [teams, setTeams] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Estados de UI y control
  const [error, setError] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Estados para Modal de Asignación
  const [grupoAAsignar, setGrupoAAsignar] = useState(null);
  const [equiposDisponibles, setEquiposDisponibles] = useState([]);
  const [selectedEquipoIds, setSelectedEquipoIds] = useState([]);
  const [loadingDisponibles, setLoadingDisponibles] = useState(false);
  const [busquedaEquipo, setBusquedaEquipo] = useState(""); // Filtro para el modal

  // Endpoints
  const endpoint = `${API_ENDPOINT}equipo`;
  const infoEndpoint = `${API_ENDPOINT}equipos`;
  const gruposEndpoint = `${API_ENDPOINT}grupos`;
  const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

  // Previsualización y limpieza de memoria de imagen seleccionada
  useEffect(() => {
    if (!archivo) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(archivo);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [archivo]);

  // Carga de equipos con paginación
  const fetchInfoEquipos = useCallback(async () => {
    try {
      const response = await axios.get(`${infoEndpoint}?page=${currentPage}`);
      setTeams(response.data.data);
      setLastPage(response.data.last_page);
    } catch (err) {
      setError("Error al cargar los equipos.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, infoEndpoint]);

  useEffect(() => {
    document.title = "Admin - Equipos";
    fetchInfoEquipos();
  }, [fetchInfoEquipos]);

  // Cargar lista inicial de grupos y subcategorías
  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const [resGrupos, resSubcats] = await Promise.all([
          axios.get(gruposEndpoint),
          axios.get(subcategoriasEndpoint),
        ]);
        setGrupos(resGrupos.data);
        setSubcategorias(resSubcats.data);
      } catch (err) {
        console.error("Error en carga inicial:", err);
      }
    };
    fetchInicial();
  }, [gruposEndpoint, subcategoriasEndpoint]);

  // Filtrar grupos por subcategoría seleccionada
  const fetchGruposPorSubcategoria = useCallback(async () => {
    if (!selectedSubcategoria) return;
    try {
      const response = await axios.get(`${API_ENDPOINT}grupos/${selectedSubcategoria}`);
      setGrupos(response.data);
    } catch (err) {
      console.error("Error al obtener grupos por subcategoría:", err);
    }
  }, [selectedSubcategoria]);

  useEffect(() => {
    fetchGruposPorSubcategoria();
  }, [fetchGruposPorSubcategoria]);

  // Popovers de Bootstrap
  useEffect(() => {
    if (!window.bootstrap) return;
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(
      (el) =>
        new window.bootstrap.Popover(el, {
          html: true,
          sanitize: false,
          placement: "bottom",
          trigger: "focus",
        })
    );
    return () => popoverList.forEach((p) => p.dispose && p.dispose());
  }, [grupos]);

  // Manejadores de formulario
  const store = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("color_hover", colorHover);
    if (archivo) formData.append("archivo", archivo);

    try {
      await axios.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchInfoEquipos();
      setAlerta({ mensaje: "Equipo registrado exitosamente.", tipo: "success" });
      setNombre("");
      setArchivo(null);
      setColorHover("");
    } catch (err) {
      setAlerta({ mensaje: "Error al agregar el equipo.", tipo: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTeam = async (team) => {
    try {
      const grupoIds = team.grupo_ids 
        ? team.grupo_ids 
        : (team.grupos ? team.grupos.map((g) => g.id) : (team.grupo_id ? [team.grupo_id] : []));

      const data = {
        nombre: team.nombre,
        grupo_ids: grupoIds,
        color_hover: team.color_hover,
      };

      if (team.archivo && typeof team.archivo !== "string") {
        const base64Archivo = await new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(team.archivo);
        });
        data.archivo = base64Archivo;
      }

      await axios.put(`${endpoint}/${team.id}`, data, {
        headers: { "Content-Type": "application/json" },
      });

      setAlerta({ mensaje: "Equipo actualizado exitosamente.", tipo: "success" });
      fetchInfoEquipos();
      if (selectedSubcategoria) fetchGruposPorSubcategoria();
      setSelectedTeam(null);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      setAlerta({ mensaje: `Error: ${msg}`, tipo: "danger" });
    }
  };

  const deleteEquipos = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este equipo después de eliminarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setAlerta({ mensaje: "Equipo eliminado correctamente!", tipo: "success" });
        fetchInfoEquipos();
      } catch (err) {
        setAlerta({ mensaje: "Error al eliminar el equipo!", tipo: "danger" });
        Swal.fire("Error", "No se pudo eliminar el equipo.", "error");
      }
    }
  };

  // Abrir Modal y Cargar TODOS los equipos disponibles sin paginar
  const abrirModalAsignacion = async (grupo) => {
    setGrupoAAsignar(grupo);
    setBusquedaEquipo("");
    const idsActuales = grupo.equipos ? grupo.equipos.map((eq) => eq.id) : [];
    setSelectedEquipoIds(idsActuales);
    setLoadingDisponibles(true);

    try {
      // Nota: Si tu backend requiere un flag para traer todos sin paginación, agrégalo aquí (ej: ?all=true)
      const res = await axios.get(`${API_ENDPOINT}equipos?all=true`);
      const listaEquipos = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setEquiposDisponibles(listaEquipos);
    } catch (err) {
      setAlerta({ mensaje: "Error al obtener lista de equipos.", tipo: "danger" });
    } finally {
      setLoadingDisponibles(false);
    }
  };

  // Alternar selección (Agregar o Quitar ID)
  const handleToggleEquipo = (id) => {
    setSelectedEquipoIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Guardar la asignación/desasignación en la BD
  const guardarAsignacionGrupo = async () => {
    if (!grupoAAsignar) return;

    try {
      await axios.put(`${API_ENDPOINT}grupos/${grupoAAsignar.id}/equipos`, {
        equipo_ids: selectedEquipoIds,
      });

      setAlerta({
        mensaje: `Equipos del grupo "${grupoAAsignar.nombre}" actualizados correctamente.`,
        tipo: "success",
      });

      const modalEl = document.getElementById("asignarEquiposModal");
      const modalInstance = window.bootstrap?.Modal?.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      fetchInfoEquipos();
      fetchGruposPorSubcategoria();
    } catch (err) {
      setAlerta({ mensaje: "Error al asignar los equipos al grupo.", tipo: "danger" });
    }
  };

  // Filtrado local para el modal
  const equiposFiltrados = equiposDisponibles.filter((eq) =>
    eq.nombre.toLowerCase().includes(busquedaEquipo.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="loading-container">
        <Cargando />
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <ErrorCarga />
      </div>
    );
  }

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

      {/* Formulario */}
      <form className="col-md-12 mt-2 mb-4" onSubmit={store} autoComplete="off">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Equipo:</label>
          <input
            required
            type="text"
            className="form-control form-input-admin"
            id="nombre"
            placeholder="Ej: Lobos FC"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group mt-3">
          <label htmlFor="archivo">Añadir Logo del Equipo:</label>
          <input
            type="file"
            className="form-control form-input-admin"
            id="archivo"
            accept="image/*"
            onChange={(e) => setArchivo(e.target.files[0] || null)}
          />
          {previewUrl && (
            <div className="mt-3">
              <p className="mb-1 text-muted small">Vista previa del logo:</p>
              <img
                src={previewUrl}
                alt="Logo preview"
                width="120"
                className="img-thumbnail"
              />
            </div>
          )}
        </div>

        <div className="form-group mt-3">
          <label htmlFor="color_hover">Color de fondo:</label>
          <input
            type="color"
            id="color_hover"
            name="color_hover"
            className="form-control form-input-admin"
            value={colorHover}
            onChange={(e) => setColorHover(e.target.value)}
          />
          {colorHover ? (
            <div className="mt-2">
              <span
                style={{
                  display: "inline-block",
                  width: "25px",
                  height: "15px",
                  borderRadius: "4px",
                  backgroundColor: colorHover,
                  border: "1px solid #ccc",
                }}
              ></span>{" "}
              <strong>Color seleccionado:</strong> {colorHover}
            </div>
          ) : (
            <div className="mt-2 text-muted">Ningún color seleccionado</div>
          )}
        </div>

        <div className="d-flex mt-3 mb-2">
          <button
            className="btn btn-outline-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrar Equipo"}
          </button>
        </div>
      </form>

      {/* Selector de subcategoría */}
      <h3 className="mt-4 mb-3">Información del grupo</h3>
      <div className="col-md-12">
        <select
          id="subcategoria"
          className="form-control mb-4"
          value={selectedSubcategoria}
          onChange={(e) => setSelectedSubcategoria(e.target.value)}
        >
          <option value="">Seleccione una subcategoría</option>
          {subcategorias.map((subcat) => (
            <option key={subcat.id} value={subcat.id}>
              {subcat.nombre} - {subcat.categoria?.torneo?.nombre}
            </option>
          ))}
        </select>
      </div>

      {!selectedSubcategoria ? (
        <p className="text-muted mt-3">Sin búsqueda seleccionada.</p>
      ) : grupos.length === 0 ? (
        <p className="text-muted mt-3">
          No hay grupos ni equipos registrados en esta subcategoría.
        </p>
      ) : (
        <div className="d-flex flex-wrap gap-3 mt-3 mb-4">
          {grupos.map((grupo) => (
            <div className="card p-2 shadow-sm" style={{ minWidth: "220px" }} key={grupo.id}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="m-0 fw-bold">{grupo.nombre}</h5>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                  data-bs-toggle="modal"
                  data-bs-target="#asignarEquiposModal"
                  onClick={() => abrirModalAsignacion(grupo)}
                  title="Administrar equipos en este grupo"
                >
                  <GroupAddIcon fontSize="small" /> +
                </button>
              </div>

              <div className="btn-group w-100">
                <button
                  type="button"
                  className="btn btn-primary btn-sm dropdown-toggle w-100"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Ver equipos ({grupo.equipos ? grupo.equipos.length : 0})
                </button>
                <ul className="dropdown-menu p-2 w-100" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {grupo.equipos && grupo.equipos.length > 0 ? (
                    grupo.equipos.map((eq) => (
                      <li key={eq.id} className="dropdown-item d-flex align-items-center">
                        <img
                          src={eq.archivo ? `${IMAGES_URL}/${eq.archivo}` : ErrorLogo}
                          alt={eq.nombre}
                          width="25"
                          height="25"
                          style={{ borderRadius: "4px", objectFit: "cover", marginRight: "8px" }}
                          onError={(e) => { e.target.src = ErrorLogo; }}
                        />
                        <span>{eq.nombre}</span>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-muted text-center small">
                      Sin equipos asignados
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabla general */}
      <div className="scroll-container">
        <table className="table table-striped">
          <thead className="thead-light">
            <tr>
              <th className="text-center">Logo</th>
              <th className="text-center">Grupos</th>
              <th className="text-center">Equipo</th>
              <th className="text-center">Subcategoría</th>
              <th className="text-center">Torneo</th>
              <th className="text-center">Color</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const listaGrupos = team.grupos || (team.grupo ? [team.grupo] : []);
              const subcatsUnicas = [
                ...new Set(
                  listaGrupos.map((g) => g.subcategoria?.nombre).filter(Boolean)
                ),
              ];
              const torneosUnicos = [
                ...new Set(
                  listaGrupos.map((g) => g.subcategoria?.categoria?.torneo?.nombre).filter(Boolean)
                ),
              ];

              return (
                <tr key={team.id}>
                  <td className="text-center">
                    <img
                      src={team.archivo ? `${IMAGES_URL}/${team.archivo}` : ErrorLogo}
                      width="40"
                      height="40"
                      style={{ objectFit: "cover", borderRadius: "4px" }}
                      className="d-block mx-auto my-1 logo"
                      alt="logo equipo"
                      onError={(e) => {
                        e.target.src = ErrorLogo;
                        e.target.classList.add("error-logo");
                      }}
                    />
                  </td>

                  <td className="text-center align-middle">
                    {listaGrupos.length > 0 ? (
                      <div className="d-flex flex-wrap justify-content-center gap-1">
                        {listaGrupos.map((g) => (
                          <span key={g.id} className="badge bg-secondary">
                            {g.nombre}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="badge bg-light text-dark border">Sin grupo</span>
                    )}
                  </td>

                  <td className="text-center align-middle fw-bold">{team.nombre}</td>
                  <td className="text-center align-middle">
                    {subcatsUnicas.length > 0 ? subcatsUnicas.join(", ") : "Sin subcategoría"}
                  </td>
                  <td className="text-center align-middle">
                    {torneosUnicos.length > 0 ? torneosUnicos.join(", ") : "N/A"}
                  </td>

                  <td className="text-center align-middle">
                    {team.color_hover ? (
                      <span
                        title={`Color: ${team.color_hover}`}
                        style={{
                          display: "inline-block",
                          width: "25px",
                          height: "15px",
                          borderRadius: "4px",
                          backgroundColor: team.color_hover,
                          border: "1px solid #ccc",
                        }}
                      ></span>
                    ) : (
                      <span className="text-muted">Sin color</span>
                    )}
                  </td>

                  <td className="text-center align-middle">
                    <button
                      type="button"
                      className="btn btn-warning btn-sm mx-1"
                      data-bs-toggle="modal"
                      data-bs-target="#editModal"
                      onClick={() => setSelectedTeam(team)}
                    >
                      <CreateIcon fontSize="small" />
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm mx-1 delete-btn"
                      onClick={() => deleteEquipos(team.id)}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <EditTeamModal
          team={selectedTeam}
          onUpdate={handleUpdateTeam}
          grupos={grupos}
        />
      </div>

      {/* Paginación */}
      <div className="pagination mb-4 d-flex justify-content-center align-items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn btn-outline-primary btn-sm"
        >
          ← Anterior
        </button>
        <span className="mx-2">{`Página ${currentPage} de ${lastPage}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
          disabled={currentPage === lastPage}
          className="btn btn-outline-primary btn-sm"
        >
          Siguiente →
        </button>
      </div>

      {/* Modal de Asignación con Buscador */}
      <div
        className="modal fade"
        id="asignarEquiposModal"
        tabIndex="-1"
        aria-labelledby="asignarEquiposModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="asignarEquiposModalLabel">
                Administrar Equipos en <strong>{grupoAAsignar?.nombre}</strong>
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {loadingDisponibles ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status"></div>
                  <p className="mt-2">Cargando equipos...</p>
                </div>
              ) : equiposDisponibles.length === 0 ? (
                <div className="alert alert-warning text-center">
                  No hay equipos disponibles para asignar.
                </div>
              ) : (
                <div>
                  <p className="text-muted small mb-2">
                    Marca para agregar o desmarca para quitar el equipo del grupo:
                  </p>

                  <input
                    type="text"
                    className="form-control form-control-sm mb-3"
                    placeholder="Buscar equipo..."
                    value={busquedaEquipo}
                    onChange={(e) => setBusquedaEquipo(e.target.value)}
                  />

                  <div className="list-group" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {equiposFiltrados.map((eq) => {
                      const isChecked = selectedEquipoIds.includes(eq.id);
                      return (
                        <label
                          key={eq.id}
                          className={`list-group-item d-flex justify-content-between align-items-center user-select-none ${
                            isChecked ? "bg-primary-subtle border-primary-subtle" : ""
                          }`}
                          style={{ cursor: "pointer", transition: "background-color 0.2s ease" }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <input
                              className="form-check-input custom-checkbox me-2"
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleEquipo(eq.id)}
                            />
                            {eq.archivo && (
                              <img
                                src={`${IMAGES_URL}/${eq.archivo}`}
                                alt={eq.nombre}
                                width="30"
                                height="30"
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                onError={(e) => { e.target.src = ErrorLogo; }}
                              />
                            )}
                            <span className={isChecked ? "fw-bold text-primary" : "fw-semibold text-dark"}>
                              {eq.nombre}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                    {equiposFiltrados.length === 0 && (
                      <div className="p-2 text-center text-muted small">No se encontraron equipos.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={guardarAsignacionGrupo}
              >
                Guardar ({selectedEquipoIds.length} seleccionados)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormTeams;