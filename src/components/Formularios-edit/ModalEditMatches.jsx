/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const EditMatchModal = ({ showModal, matchData, API_ENDPOINT, onSave, onClose }) => {
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [torneoId, setTorneoId] = useState(matchData?.torneoId || "");
  const [categoriaId, setCategoriaId] = useState(matchData?.categoriaId || "");
  const [subcategoriaId, setSubcategoriaId] = useState(
    matchData?.subcategoriaId || ""
  );
  const [grupoId, setGrupoId] = useState(matchData?.grupoId || "");
  const [equipoA_id, setEquipoLocal] = useState(
    matchData?.equipoA_id || ""
  );
  const [equipoB_id, setEquipoVisitante] = useState(
    matchData?.equipoB_id || ""
  );
  const [marcador1, setMarcador1] = useState(matchData?.marcador1 || 0);
  const [marcador2, setMarcador2] = useState(matchData?.marcador2 || 0);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!torneoId) newErrors.torneoId = "Selecciona un torneo";
    if (!categoriaId) newErrors.categoriaId = "Selecciona una categoría";
    if (!subcategoriaId) newErrors.subcategoriaId = "Selecciona una subcategoría";
    if (!grupoId) newErrors.grupoId = "Selecciona un grupo";
    if (!equipoA_id) newErrors.equipoAId = "Selecciona el equipo local";
    if (!equipoB_id) newErrors.equipoBId = "Selecciona el equipo visitante";
    if (equipoA_id === equipoB_id) newErrors.equipos = "Los equipos no pueden ser iguales";
    if (!fecha) newErrors.fecha = "Selecciona una fecha";
    if (!hora) newErrors.hora = "Selecciona una hora";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

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
  }, [API_ENDPOINT]);

  useEffect(() => {
    if (torneoId) {
      const fetchCategorias = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINT}categorias/${torneoId}`
          );
          setCategorias(response.data);
          setSubcategorias([]);
          setGrupos([]);
          setEquipos([]);
        } catch (error) {
          console.error("Error al cargar categorías:", error);
        }
      };
      fetchCategorias();
    } else {
      setCategorias([]);
    }
  }, [torneoId, API_ENDPOINT]);

  useEffect(() => {
    if (categoriaId) {
      const fetchSubcategorias = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINT}categoria/${categoriaId}/subcategorias`
          );
          setSubcategorias(response.data);
          setGrupos([]);
          setEquipos([]);
        } catch (error) {
          console.error("Error al cargar subcategorías:", error);
        }
      };
      fetchSubcategorias();
    } else {
      setSubcategorias([]);
    }
  }, [categoriaId, API_ENDPOINT]);

  useEffect(() => {
    if (subcategoriaId) {
      const fetchGrupos = async () => {
        try {
          const response = await axios.get(
            `${API_ENDPOINT}grupos/${subcategoriaId}`
          );
          setGrupos(response.data);
          setEquipos([]);
        } catch (error) {
          console.error("Error al cargar grupos:", error);
        }
      };
      fetchGrupos();
    } else {
      setGrupos([]);
    }
  }, [subcategoriaId, API_ENDPOINT]);

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
  }, [grupoId, API_ENDPOINT]);

  const handleSave = () => {
    if (!validateForm()) {
      console.log("Errores en el formulario:", errors); // Para depuración
      return; // Detiene la ejecución si hay errores
    }
    
  
   const updatedPartido = {
  id: matchData.id,
  equipoA_id,
  equipoB_id,
  marcador1,
  marcador2,
  fecha,
  hora,
};

  
    onSave(updatedPartido);
    onClose();

    
  };
  

// Al montar el modal, precargar datos del partido
useEffect(() => {
  if (matchData) {
    setFecha(matchData.fecha || "");
    setHora(matchData.hora || "");
    setMarcador1(matchData.marcador1 || 0);
    setMarcador2(matchData.marcador2 || 0);

    setTorneoId(matchData.torneoId || "");
    setCategoriaId(matchData.categoriaId || "");
    setSubcategoriaId(matchData.subcategoriaId || "");
    setGrupoId(matchData.grupoId || "");
    setEquipoLocal(matchData.equipoA_id || "");
    setEquipoVisitante(matchData.equipoB_id || "");
  }
}, [matchData]);

// Cuando torneos se cargan, fijar el torneo del partido
useEffect(() => {
  if (torneos.length > 0 && matchData?.torneoId) {
    setTorneoId(matchData.torneoId);
  }
}, [torneos, matchData]);

// Cuando categorías se cargan, fijar la categoría del partido
useEffect(() => {
  if (categorias.length > 0 && matchData?.categoriaId) {
    setCategoriaId(matchData.categoriaId);
  }
}, [categorias, matchData]);

// Cuando subcategorías se cargan, fijar la subcategoría
useEffect(() => {
  if (subcategorias.length > 0 && matchData?.subcategoriaId) {
    setSubcategoriaId(matchData.subcategoriaId);
  }
}, [subcategorias, matchData]);

// Cuando grupos se cargan, fijar el grupo
useEffect(() => {
  if (grupos.length > 0 && matchData?.grupoId) {
    setGrupoId(matchData.grupoId);
  }
}, [grupos, matchData]);

// Cuando equipos se cargan, fijar equipo A y B
useEffect(() => {
  if (equipos.length > 0) {
    if (matchData?.equipoA_id) setEquipoLocal(matchData.equipoA_id);
    if (matchData?.equipoB_id) setEquipoVisitante(matchData.equipoB_id);
  }
}, [equipos, matchData]);


  if (!showModal) return null;

  return (
    <div className="modal"  style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content"   id="editModal"
      tabIndex="-1">
          <div className="modal-header">
            <h5 className="modal-title">Editar Partido</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="modal-body">
            <form autoComplete="off">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-6 ml-auto ">
                    <div className="form-group">
                      <label htmlFor="torneo_id">Selecciona un Torneo:</label>
                      <select
                        id="torneo_id"
                        className="form-control"
                        value={torneoId}
                        onChange={(e) => setTorneoId(e.target.value)}
                        disabled={torneos.length === 0}
                      >
                        <option value="" disabled>
                          {torneos.length === 0
                            ? "Cargando torneos..."
                            : "Selecciona un torneo"}
                        </option>
                        {torneos.length > 0 ? (
                          torneos.map((torneo) => (
                            <option key={torneo.id} value={torneo.id}>
                              {torneo.nombre}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            Ocurrió un error al cargar los torneos.
                          </option>
                        )}
                      </select>
                      {errors.torneoId && <small className="text-danger">{errors.torneoId}</small>}
                    </div>
                  </div>

                  <div className="col-md-6 ml-auto ">
                    <div className="form-group">
                      <label htmlFor="categoria_id">
                        Selecciona Categoría:
                      </label>
                      <select
                        id="categoria_id"
                        className="form-control"
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        disabled={!torneoId || categorias.length === 0} // Deshabilitado si no hay torneo o categorías
                      >
                        <option value="" disabled>
                          {!torneoId
                            ? "Selecciona un torneo primero"
                            : categorias.length === 0
                              ? "Cargando categorías..."
                              : "Selecciona una categoría"}
                        </option>
                        {categorias.length === 0 ? (
                          // Mostrar mensaje si no hay categorías
                          <option value="" disabled>
                            No hay categorías asociadas a este torneo
                          </option>
                        ) : (
                          // Mostrar las categorías si están cargadas
                          categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nombre}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.categoriaId && <small className="text-danger">{errors.categoriaId}</small>}
                    </div>
                  </div>

                  <div className="col-md-6 ml-auto ">
                    <div className="form-group">
                      <label htmlFor="subcategoria_id">
                        Selecciona Subcategoría:
                      </label>
                      <select
                        id="subcategoria_id"
                        className="form-control"
                        value={subcategoriaId}
                        onChange={(e) => setSubcategoriaId(e.target.value)}
                        disabled={!categoriaId || subcategorias.length === 0}
                      >
                        <option value="" disabled>
                          {!categoriaId
                            ? "Selecciona una categoría primero"
                            : subcategorias.length === 0
                              ? "Cargando subcategorías..."
                              : "Selecciona una subcategoría"}
                        </option>
                        {subcategorias.length === 0 ? (
                          <option value="" disabled>
                            No hay subcategorías asociadas a esta categoría
                          </option>
                        ) : (
                          subcategorias.map((subcategoria) => (
                            <option
                              key={subcategoria.id}
                              value={subcategoria.id}
                            >
                              {subcategoria.nombre}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.subcategoriaId && <small className="text-danger">{errors.subcategoriaId}</small>}
                    </div>
                  </div>

                  <div className="col-md-6 ml-auto ">
                    <div className="form-group">
                      <label htmlFor="grupo_id">Selecciona Grupo:</label>
                      <select
                        id="grupo_id"
                        className="form-control"
                        value={grupoId}
                        onChange={(e) => setGrupoId(e.target.value)}
                        disabled={!subcategoriaId || grupos.length === 0}
                      >
                        <option value="" disabled>
                          {!subcategoriaId
                            ? "Selecciona una subcategoría primero"
                            : grupos.length === 0
                              ? "Cargando grupos..."
                              : "Selecciona un grupo"}
                        </option>
                        {grupos.length === 0 ? (
                          <option value="" disabled>
                            No hay grupos asociados a esta subcategoría
                          </option>
                        ) : (
                          grupos.map((grupo) => (
                            <option key={grupo.id} value={grupo.id}>
                              {grupo.nombre}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.grupoId && <small className="text-danger">{errors.grupoId}</small>}
                    </div>
                  </div>

                  <div className="col-md-3 ml-auto ">
                    <div>
                      <label htmlFor="equipo_local">Equipo Local:</label>
                      <select
                        id="equipo_local"
                        className="form-control"
                        onChange={(e) => setEquipoLocal(e.target.value)}
                        value={equipoA_id}
                        disabled={equipos.length === 0}
                      >
                        <option value="" disabled>
                          {equipos.length === 0
                            ? "Cargando equipos..."
                            : "Selecciona un Equipo"}
                        </option>
                        {equipos.length === 0 ? (
                          <option value="" disabled>
                            No hay equipos disponibles
                          </option>
                        ) : (
                          equipos.map((equipo) => (
                            <option key={equipo.id} value={equipo.id}>
                              {equipo.nombre}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.equipoA_id && <small className="text-danger">{errors.equipoA_id}</small>}
                    </div>
                  </div>

                  <div className="col-md-3 ml-auto ">
                    <div>
                      <label>Marcador Local:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={marcador1}
                        onChange={(e) => setMarcador1(e.target.value)}
                        placeholder="Marcador Local"
                      />
                    </div>
                  </div>

                  <div className="col-md-3 ml-auto ">
                    <div>
                      <label>Marcador Visitante:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={marcador2}
                        onChange={(e) => setMarcador2(e.target.value)}
                        placeholder="Marcador Visitante"
                      />
                    </div>
                  </div>

                  <div className="col-md-3 ml-auto ">
                    <div>
                      <label htmlFor="equipo_visitante">
                        Equipo Visitante:
                      </label>
                      <select
                        id="equipo_visitante"
                        className="form-control"
                        onChange={(e) => setEquipoVisitante(e.target.value)}
                        value={equipoB_id}
                        disabled={equipos.length === 0}
                      >
                        <option value="" disabled>
                          {equipos.length === 0
                            ? "Cargando equipos..."
                            : "Selecciona un Equipo"}
                        </option>
                        {equipos.length === 0 ? (
                          <option value="" disabled>
                            No hay equipos disponibles
                          </option>
                        ) : (
                          equipos.map((equipo) => (
                            <option key={equipo.id} value={equipo.id}>
                              {equipo.nombre}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.equipoB_id && <small className="text-danger">{errors.equipoB_id}</small>}
                      {errors.equipos && <small className="text-danger">{errors.equipos}</small>}
                    </div>
                  </div>
                  {/* Fecha y Hora */}
  <div className="row">
    <div className="col-12 col-md-3 mb-3">
      <label htmlFor="fecha">Fecha</label>
      <input
        id="fecha"
        name="fecha"
        type="date"
        className="form-control"
        onChange={(e) => setFecha(e.target.value)}
        value={fecha}
      />
       {errors.fecha && <small className="text-danger">{errors.fecha}</small>}
    </div>
    <div className="col-12 col-md-3 mb-3">
      <label htmlFor="hora">Hora</label>
      <input
        id="hora"
        name="hora"
        type="time"
        className="form-control"
        onChange={(e) => setHora(e.target.value)}
        value={hora}
      />
       {errors.hora && <small className="text-danger">{errors.hora}</small>}
    </div>
  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-danger"  data-bs-dismiss="modal" onClick={onClose}>
              Cerrar
            </button>
            <button
            
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMatchModal;
