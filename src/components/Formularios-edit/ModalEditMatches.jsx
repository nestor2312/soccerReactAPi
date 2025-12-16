/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const EditMatchModal = ({ showModal, matchData, API_ENDPOINT, onSave, onClose }) => {
  // Estados
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [equipos, setEquipos] = useState([]);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // mantener todo como string para selects
  const [torneoId, setTorneoId] = useState(matchData?.torneoId ? String(matchData.torneoId) : "");
  const [categoriaId, setCategoriaId] = useState(matchData?.categoriaId ? String(matchData.categoriaId) : "");
  const [subcategoriaId, setSubcategoriaId] = useState(matchData?.subcategoriaId ? String(matchData.subcategoriaId) : "");
  const [grupoId, setGrupoId] = useState(matchData?.grupoId ? String(matchData.grupoId) : "");
  const [equipoA_id, setEquipoLocal] = useState(matchData?.equipoA_id ? String(matchData.equipoA_id) : "");
  const [equipoB_id, setEquipoVisitante] = useState(matchData?.equipoB_id ? String(matchData.equipoB_id) : "");

  const [marcador1, setMarcador1] = useState(matchData?.marcador1 ?? 0);
  const [marcador2, setMarcador2] = useState(matchData?.marcador2 ?? 0);

  const [errors, setErrors] = useState({});
  const [isPreloading, setIsPreloading] = useState(false);

  // -----------------------
  // Validación
  // -----------------------
  const validateForm = () => {
    let newErrors = {};
    if (!torneoId) newErrors.torneoId = "Selecciona un torneo";
    if (!categoriaId) newErrors.categoriaId = "Selecciona una categoría";
    if (!subcategoriaId) newErrors.subcategoriaId = "Selecciona una subcategoría";
    if (!grupoId) newErrors.grupoId = "Selecciona un grupo";
    if (!equipoA_id) newErrors.equipoA_id = "Selecciona el equipo local";
    if (!equipoB_id) newErrors.equipoB_id = "Selecciona el equipo visitante";
    if (equipoA_id && equipoA_id === equipoB_id) newErrors.equipos = "Los equipos no pueden ser iguales";
    if (!fecha) newErrors.fecha = "Selecciona una fecha";
    if (!hora) newErrors.hora = "Selecciona una hora";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // carga inicial de torneos (siempre)
  // -----------------------
  useEffect(() => {
    const fetchTorneos = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINT}torneos`);
        setTorneos(response.data || []);
      } catch (error) {
        console.error("Error al cargar los torneos:", error);
      }
    };
    fetchTorneos();
  }, [API_ENDPOINT]);

useEffect(() => {
  if (!matchData) return;

  let cancelled = false;

  const loadCascadeFromMatch = async () => {
    setIsPreloading(true);

    // Reset inicial suave sin borrar valores manualmente
    setCategorias([]);
    setSubcategorias([]);
    setGrupos([]);
    setEquipos([]);

    try {
      // Valores base
      setFecha(matchData.fecha || "");
      setHora(matchData.hora || "");
      setMarcador1(matchData.marcador1 ?? 0);
      setMarcador2(matchData.marcador2 ?? 0);

      // Extraer IDs anidados
      const torneoFromMatch =
        matchData.torneoId ??
        matchData.torneo_id ??
        matchData.equipoA?.grupo?.subcategoria?.categoria?.torneo?.id ??
        "";
      const categoriaFromMatch =
        matchData.categoriaId ??
        matchData.categoria_id ??
        matchData.equipoA?.grupo?.subcategoria?.categoria?.id ??
        "";
      const subcategoriaFromMatch =
        matchData.subcategoriaId ??
        matchData.subcategoria_id ??
        matchData.equipoA?.grupo?.subcategoria?.id ??
        "";
      const grupoFromMatch =
        matchData.grupoId ??
        matchData.grupo_id ??
        matchData.equipoA?.grupo?.id ??
        "";
      const equipoAFromMatch =
        matchData.equipoA_id ??
        matchData.equipo_a_id ??
        matchData.equipoA?.id ??
        "";
      const equipoBFromMatch =
        matchData.equipoB_id ??
        matchData.equipo_b_id ??
        matchData.equipoB?.id ??
        "";

      // 1️⃣ Torneos
      if (torneos.length === 0) {
        const resT = await axios.get(`${API_ENDPOINT}torneos`);
        if (cancelled) return;
        setTorneos(resT.data || []);
      }
      setTorneoId(String(torneoFromMatch || ""));

      // 2️⃣ Categorías
      if (torneoFromMatch) {
        const resC = await axios.get(`${API_ENDPOINT}categorias/${torneoFromMatch}`);
        if (cancelled) return;
        setCategorias(resC.data || []);
        setCategoriaId(String(categoriaFromMatch || ""));
      }

      // 3️⃣ Subcategorías
      if (categoriaFromMatch) {
        const resS = await axios.get(`${API_ENDPOINT}categoria/${categoriaFromMatch}/subcategorias`);
        if (cancelled) return;
        setSubcategorias(resS.data || []);
        setSubcategoriaId(String(subcategoriaFromMatch || ""));
      }

      // 4️⃣ Grupos
      if (subcategoriaFromMatch) {
        const resG = await axios.get(`${API_ENDPOINT}grupos/${subcategoriaFromMatch}`);
        if (cancelled) return;
        setGrupos(resG.data || []);
        setGrupoId(String(grupoFromMatch || ""));
      }

      // 5️⃣ Equipos
      if (grupoFromMatch) {
        const resE = await axios.get(`${API_ENDPOINT}equipos/${grupoFromMatch}`);
        if (cancelled) return;
        setEquipos(resE.data || []);
        setEquipoLocal(String(equipoAFromMatch || ""));
        setEquipoVisitante(String(equipoBFromMatch || ""));
      }
    } catch (err) {
      console.error("Error cargando datos en cascada:", err);
    }
  };

  loadCascadeFromMatch();

  return () => {
    cancelled = true;
  };
 
}, [matchData, API_ENDPOINT]);

 
  useEffect(() => {
    
 if (!torneoId) {
  setCategorias([]);
  setCategoriaId("");
  setSubcategorias([]);
  setSubcategoriaId("");
  setGrupos([]);
  setGrupoId("");
  setEquipos([]);
  return;
}


    const fetchCategorias = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINT}categorias/${torneoId}`);
        setCategorias(res.data || []);
        // si la categoria actual ya está en la nueva lista la mantenemos, si no, la limpiamos
        const exists = res.data?.some?.(c => String(c.id) === String(categoriaId));
        if (!exists) setCategoriaId("");
        // limpiar siguientes niveles
        setSubcategorias([]);
        setSubcategoriaId("");
        setGrupos([]);
        setGrupoId("");
        setEquipos([]);
       
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    };
    fetchCategorias();
  }, [torneoId, API_ENDPOINT, isPreloading]); // mantener isPreloading para guard

  useEffect(() => {
    if (isPreloading) return;
   if (!categoriaId) {
  setSubcategorias([]);
  setSubcategoriaId("");
  setGrupos([]);
  setGrupoId("");
  setEquipos([]);
  return;
}


    const fetchSubcategorias = async () => {
      try {
        const res = await axios.get(`${API_ENDPOINT}categoria/${categoriaId}/subcategorias`);
        setSubcategorias(res.data || []);
        const exists = res.data?.some?.(s => String(s.id) === String(subcategoriaId));
        if (!exists) setSubcategoriaId("");
        // limpiar niveles inferiores
        setGrupos([]);
        setGrupoId("");
        setEquipos([]);
       
      } catch (err) {
        console.error("Error al cargar subcategorías:", err);
      }
    };
    fetchSubcategorias();
  }, [categoriaId, API_ENDPOINT, isPreloading]);






useEffect(() => {
  if (isPreloading) return;

  if (!grupoId) {
    setEquipos([]);
   
    return;
  }

  const fetchEquipos = async () => {
    try {
      const res = await axios.get(`${API_ENDPOINT}equipos/${grupoId}`);
      setEquipos(res.data || []);
    } catch (err) {
      console.error("Error al cargar equipos:", err);
    }
  };

  fetchEquipos();
}, [grupoId, API_ENDPOINT, isPreloading]);







  // -----------------------
  // Guardar
  // -----------------------
  const handleSave = () => {
    if (!validateForm()) return;

    const updatedPartido = {
      id: matchData?.id,
      equipoA_id: equipoA_id ? Number(equipoA_id) : null,
      equipoB_id: equipoB_id ? Number(equipoB_id) : null,
      marcador1: marcador1 ?? 0,
      marcador2: marcador2 ?? 0,
      fecha,
      hora,
    
    };

    onSave(updatedPartido);
    onClose();
  };


  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" id="editModal" tabIndex="1">
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
                  {/* Torneo */}
                  <div className="col-6 col-md-6">
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
                        {torneos.map((torneo) => (
                          <option key={torneo.id} value={torneo.id}>
                            {torneo.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.torneoId && <small className="text-danger">{errors.torneoId}</small>}
                    </div>
                  </div>

                  {/* Categoría */}
                  <div className="col-6 col-md-6">
                    <div className="form-group">
                      <label htmlFor="categoria_id">Selecciona Categoría:</label>
                      <select
                        id="categoria_id"
                        className="form-control"
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        disabled={!torneoId || categorias.length === 0}
                      >
                        <option value="" disabled>
                          {!torneoId
                            ? "Selecciona un torneo primero"
                            : categorias.length === 0
                            ? "Cargando categorías..."
                            : "Selecciona una categoría"}
                        </option>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.categoriaId && <small className="text-danger">{errors.categoriaId}</small>}
                    </div>
                  </div>

                  {/* Subcategoría */}
                  <div className="col-6 col-md-6">
                    <div className="form-group">
                      <label htmlFor="subcategoria_id">Selecciona Subcategoría:</label>
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
                        {subcategorias.map((subcategoria) => (
                          <option key={subcategoria.id} value={subcategoria.id}>
                            {subcategoria.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.subcategoriaId && <small className="text-danger">{errors.subcategoriaId}</small>}
                    </div>
                  </div>

                  {/* Grupo */}
                  <div className="col-6 col-md-6">
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
                        {grupos.map((grupo) => (
                          <option key={grupo.id} value={grupo.id}>
                            {grupo.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.grupoId && <small className="text-danger">{errors.grupoId}</small>}
                    </div>
                  </div>

                  {/* Equipo Local */}
                  <div className="col-6 col-md-3">
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
                          {equipos.length === 0 ? "Cargando equipos..." : "Selecciona un Equipo"}
                        </option>
                        {equipos.map((equipo) => (
                          <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.equipoA_id && <small className="text-danger">{errors.equipoA_id}</small>}
                    </div>
                  </div>

                  {/* Marcador Local */}
                  <div className="col-6 col-md-3">
                    <div>
                      <label>Marcador Local:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={marcador1}
                        onChange={(e) => setMarcador1(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Marcador Visitante */}
                  <div className="col-6 col-md-3">
                    <div>
                      <label>Marcador Visitante:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={marcador2}
                        onChange={(e) => setMarcador2(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Equipo Visitante */}
                  <div className="col-6 col-md-3">
                    <div>
                      <label htmlFor="equipo_visitante">Equipo Visitante:</label>
                      <select
                        id="equipo_visitante"
                        className="form-control"
                        onChange={(e) => setEquipoVisitante(e.target.value)}
                        value={equipoB_id}
                        disabled={equipos.length === 0}
                      >
                        <option value="" disabled>
                          {equipos.length === 0 ? "Cargando equipos..." : "Selecciona un Equipo"}
                        </option>
                        {equipos.map((equipo) => (
                          <option key={equipo.id} value={equipo.id}>
                            {equipo.nombre}
                          </option>
                        ))}
                      </select>
                      {errors.equipoB_id && <small className="text-danger">{errors.equipoB_id}</small>}
                      {errors.equipos && <small className="text-danger">{errors.equipos}</small>}
                    </div>
                  </div>

                  {/* Fecha y Hora */}
                  <div className="row">
                    <div className="col-6 col-md-3 mb-3">
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
                    <div className="col-6 col-md-3 mb-3">
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
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMatchModal;
