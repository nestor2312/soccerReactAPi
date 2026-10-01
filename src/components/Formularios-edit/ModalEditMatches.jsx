/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Helper para extraer arreglos de respuestas de Axios de forma segura
const extractData = (res) => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

// Helper para encontrar el primer ID válido (omite null, undefined, "", "null")
const findId = (...args) => {
  const found = args.find(
    (val) =>
      val !== undefined &&
      val !== null &&
      String(val).trim() !== "" &&
      String(val) !== "null" &&
      String(val) !== "undefined"
  );
  return found !== undefined ? String(found) : "";
};

const EditMatchModal = ({ showModal, matchData, API_ENDPOINT, onSave, onClose }) => {
  const baseUrl = API_ENDPOINT ? (API_ENDPOINT.endsWith("/") ? API_ENDPOINT : `${API_ENDPOINT}/`) : "";

  // Estados de listas de opciones
  const [torneos, setTorneos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [equipos, setEquipos] = useState([]);

  // Estados de formulario
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [sede, setSede] = useState("");
  const [jornada, setJornada] = useState("");

  // IDs seleccionados
  const [torneoId, setTorneoId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [grupoId, setGrupoId] = useState("");
  const [equipoA_id, setEquipoLocal] = useState("");
  const [equipoB_id, setEquipoVisitante] = useState("");

  const [marcador1, setMarcador1] = useState(0);
  const [marcador2, setMarcador2] = useState(0);

  const [errors, setErrors] = useState({});
  const [isPreloading, setIsPreloading] = useState(false);

  // Carga inicial de torneos
  const fetchTorneos = useCallback(async () => {
    try {
      const response = await axios.get(`${baseUrl}torneos`);
      const dataList = extractData(response);
      setTorneos(dataList);
      return dataList;
    } catch (error) {
      console.error("❌ Error al cargar torneos:", error);
      return [];
    }
  }, [baseUrl]);

  // Carga en cascada garantizando que las opciones existan antes de seleccionar
  useEffect(() => {
    if (!matchData || !showModal) return;

    let cancelled = false;

    const loadDataCascade = async () => {
      setIsPreloading(true);

      let targetMatch = matchData;

      try {
        // 1. Obtener el partido completo si no trae las relaciones
        if (matchData.id && !matchData.equipo_a && !matchData.equipoA) {
          try {
            const resMatch = await axios.get(`${baseUrl}partidos/${matchData.id}`);
            const fullMatch = resMatch?.data?.data || resMatch?.data;
            if (fullMatch) targetMatch = fullMatch;
          } catch (e) {
            console.warn("⚠️ No se pudo consultar partido por API, usando props:", e);
          }
        }

        // 2. Asignar campos planos (Maneja valores null convirtiéndolos en "")
        setFecha(targetMatch.fecha || "");
        setHora(targetMatch.hora || "");
        setMarcador1(targetMatch.marcador1 ?? 0);
        setMarcador2(targetMatch.marcador2 ?? 0);
        setJornada(targetMatch.jornada || "");
        setSede(targetMatch.sede || "");

        // 3. Extraer entidades desde la jerarquía del JSON
        const eqA = targetMatch.equipo_a || targetMatch.equipoA;
        const eqB = targetMatch.equipo_b || targetMatch.equipoB;

        // Buscar el grupo coincidente dentro del array `grupos`
        let grupoObj = null;
        if (eqA) {
          const targetGrupoId = targetMatch.grupoId || targetMatch.grupo_id || eqA.grupo_id;
          if (Array.isArray(eqA.grupos) && eqA.grupos.length > 0) {
            grupoObj = eqA.grupos.find((g) => String(g.id) === String(targetGrupoId)) || eqA.grupos[0];
          } else if (eqA.grupo) {
            grupoObj = Array.isArray(eqA.grupo) ? eqA.grupo[0] : eqA.grupo;
          }
        }

        const subcatObj = grupoObj?.subcategoria;
        const catObj = subcatObj?.categoria;
        const torneoObj = catObj?.torneo;

        // 4. Extraer IDs
        const extractedTorneoId = findId(torneoObj?.id, catObj?.torneo_id);
        const extractedCategoriaId = findId(catObj?.id, subcatObj?.categoria_id);
        const extractedSubcategoriaId = findId(subcatObj?.id, grupoObj?.subcategoria_id);
        const extractedGrupoId = findId(grupoObj?.id, eqA?.grupo_id, eqB?.grupo_id);
        const extractedEquipoAId = findId(targetMatch.equipoA_id, targetMatch.equipo_a_id, eqA?.id);
        const extractedEquipoBId = findId(targetMatch.equipoB_id, targetMatch.equipo_b_id, eqB?.id);

        // 5. Cargar peticiones HTTP secuenciales para llenar los arreglos antes de asignar selección
        let loadedCategorias = [];
        let loadedSubcategorias = [];
        let loadedGrupos = [];
        let loadedEquipos = [];

        await fetchTorneos();

        if (extractedTorneoId) {
          const res = await axios.get(`${baseUrl}categorias/${extractedTorneoId}`);
          loadedCategorias = extractData(res);
        }

        if (extractedCategoriaId) {
          const res = await axios.get(`${baseUrl}categoria/${extractedCategoriaId}/subcategorias`);
          loadedSubcategorias = extractData(res);
        }

        if (extractedSubcategoriaId) {
          const res = await axios.get(`${baseUrl}grupos/${extractedSubcategoriaId}`);
          loadedGrupos = extractData(res);
        }

        if (extractedGrupoId) {
          const res = await axios.get(`${baseUrl}equipos/${extractedGrupoId}`);
          loadedEquipos = extractData(res);
        }

        if (cancelled) return;

        // 6. Actualizar las listas de opciones
        setCategorias(loadedCategorias);
        setSubcategorias(loadedSubcategorias);
        setGrupos(loadedGrupos);
        setEquipos(loadedEquipos);

        // 7. Seleccionar los valores en los select
        setTorneoId(extractedTorneoId);
        setCategoriaId(extractedCategoriaId);
        setSubcategoriaId(extractedSubcategoriaId);
        setGrupoId(extractedGrupoId);
        setEquipoLocal(extractedEquipoAId);
        setEquipoVisitante(extractedEquipoBId);
      } catch (err) {
        console.error("❌ Error al procesar datos del partido:", err);
      } finally {
        if (!cancelled) setIsPreloading(false);
      }
    };

    loadDataCascade();

    return () => {
      cancelled = true;
    };
  }, [matchData, showModal, baseUrl, fetchTorneos]);

  // Handlers para cambios manuales del usuario
  const handleTorneoChange = async (id) => {
    setTorneoId(id);
    setCategoriaId(""); setSubcategoriaId(""); setGrupoId(""); setEquipoLocal(""); setEquipoVisitante("");
    setCategorias([]); setSubcategorias([]); setGrupos([]); setEquipos([]);
    if (id) {
      try {
        const res = await axios.get(`${baseUrl}categorias/${id}`);
        setCategorias(extractData(res));
      } catch (err) {
        console.error("Error al cargar categorías:", err);
      }
    }
  };

  const handleCategoriaChange = async (id) => {
    setCategoriaId(id);
    setSubcategoriaId(""); setGrupoId(""); setEquipoLocal(""); setEquipoVisitante("");
    setSubcategorias([]); setGrupos([]); setEquipos([]);
    if (id) {
      try {
        const res = await axios.get(`${baseUrl}categoria/${id}/subcategorias`);
        setSubcategorias(extractData(res));
      } catch (err) {
        console.error("Error al cargar subcategorías:", err);
      }
    }
  };

  const handleSubcategoriaChange = async (id) => {
    setSubcategoriaId(id);
    setGrupoId(""); setEquipoLocal(""); setEquipoVisitante("");
    setGrupos([]); setEquipos([]);
    if (id) {
      try {
        const res = await axios.get(`${baseUrl}grupos/${id}`);
        setGrupos(extractData(res));
      } catch (err) {
        console.error("Error al cargar grupos:", err);
      }
    }
  };

  const handleGrupoChange = async (id) => {
    setGrupoId(id);
    setEquipoLocal(""); setEquipoVisitante("");
    setEquipos([]);
    if (id) {
      try {
        const res = await axios.get(`${baseUrl}equipos/${id}`);
        setEquipos(extractData(res));
      } catch (err) {
        console.error("Error al cargar equipos:", err);
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!torneoId) newErrors.torneoId = "Selecciona un torneo";
    if (!categoriaId) newErrors.categoriaId = "Selecciona una categoría";
    if (!subcategoriaId) newErrors.subcategoriaId = "Selecciona una subcategoría";
    if (!grupoId) newErrors.grupoId = "Selecciona un grupo";
    if (!equipoA_id) newErrors.equipoA_id = "Selecciona el equipo local";
    if (!equipoB_id) newErrors.equipoB_id = "Selecciona el equipo visitante";
    if (equipoA_id && equipoA_id === equipoB_id) newErrors.equipos = "Los equipos no pueden ser iguales";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedPartido = {
      id: matchData?.id,
      equipoA_id: equipoA_id ? Number(equipoA_id) : null,
      equipoB_id: equipoB_id ? Number(equipoB_id) : null,
      marcador1: Number(marcador1),
      grupo_id: grupoId,
      marcador2: Number(marcador2),
      fecha,
      hora,
      jornada,
      sede,
    };

    onSave(updatedPartido);
    onClose();
  };

  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" id="editModal">
          <div className="modal-header">
            <h5 className="modal-title">Editar Partido</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {isPreloading && <p className="text-muted text-center mb-2">Cargando opciones del partido...</p>}
            <form autoComplete="off">
              <div className="container-fluid">
                <div className="row g-3">
                  {/* Torneo */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="torneo_id">Selecciona un Torneo:</label>
                      <select
                        id="torneo_id"
                        className="form-control"
                        value={String(torneoId)}
                        onChange={(e) => handleTorneoChange(e.target.value)}
                        disabled={torneos.length === 0}
                      >
                        <option value="">
                          {torneos.length === 0 ? "Cargando torneos..." : "Selecciona un torneo"}
                        </option>
                        {torneos.map((torneo) => (
                          <option key={torneo.id} value={String(torneo.id)}>
                            {torneo.nombre || torneo.name}
                          </option>
                        ))}
                      </select>
                      {errors.torneoId && <small className="text-danger">{errors.torneoId}</small>}
                    </div>
                  </div>

                  {/* Categoría */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="categoria_id">Selecciona Categoría:</label>
                      <select
                        id="categoria_id"
                        className="form-control"
                        value={String(categoriaId)}
                        onChange={(e) => handleCategoriaChange(e.target.value)}
                        disabled={!torneoId || categorias.length === 0}
                      >
                        <option value="">
                          {!torneoId
                            ? "Selecciona un torneo primero"
                            : categorias.length === 0
                            ? "Sin categorías disponibles"
                            : "Selecciona una categoría"}
                        </option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={String(cat.id)}>
                            {cat.nombre || cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoriaId && <small className="text-danger">{errors.categoriaId}</small>}
                    </div>
                  </div>

                  {/* Subcategoría */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="subcategoria_id">Selecciona Subcategoría:</label>
                      <select
                        id="subcategoria_id"
                        className="form-control"
                        value={String(subcategoriaId)}
                        onChange={(e) => handleSubcategoriaChange(e.target.value)}
                        disabled={!categoriaId || subcategorias.length === 0}
                      >
                        <option value="">
                          {!categoriaId
                            ? "Selecciona una categoría primero"
                            : subcategorias.length === 0
                            ? "Sin subcategorías disponibles"
                            : "Selecciona una subcategoría"}
                        </option>
                        {subcategorias.map((subcat) => (
                          <option key={subcat.id} value={String(subcat.id)}>
                            {subcat.nombre || subcat.name}
                          </option>
                        ))}
                      </select>
                      {errors.subcategoriaId && <small className="text-danger">{errors.subcategoriaId}</small>}
                    </div>
                  </div>

                  {/* Grupo */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label htmlFor="grupo_id">Selecciona Grupo:</label>
                      <select
                        id="grupo_id"
                        className="form-control"
                        value={String(grupoId)}
                        onChange={(e) => handleGrupoChange(e.target.value)}
                        disabled={!subcategoriaId || grupos.length === 0}
                      >
                        <option value="">
                          {!subcategoriaId
                            ? "Selecciona una subcategoría primero"
                            : grupos.length === 0
                            ? "Sin grupos disponibles"
                            : "Selecciona un grupo"}
                        </option>
                        {grupos.map((grp) => (
                          <option key={grp.id} value={String(grp.id)}>
                            {grp.nombre || grp.name}
                          </option>
                        ))}
                      </select>
                      {errors.grupoId && <small className="text-danger">{errors.grupoId}</small>}
                    </div>
                  </div>

                  {/* Equipo Local */}
                  <div className="col-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="equipo_local">Equipo Local:</label>
                      <select
                        id="equipo_local"
                        className="form-control"
                        value={String(equipoA_id)}
                        onChange={(e) => setEquipoLocal(e.target.value)}
                        disabled={equipos.length === 0}
                      >
                        <option value="">
                          {equipos.length === 0 ? "Sin equipos" : "Selecciona Equipo"}
                        </option>
                        {equipos.map((eq) => (
                          <option key={eq.id} value={String(eq.id)}>
                            {eq.nombre || eq.name}
                          </option>
                        ))}
                      </select>
                      {errors.equipoA_id && <small className="text-danger d-block">{errors.equipoA_id}</small>}
                    </div>
                  </div>

                  {/* Marcador Local */}
                  <div className="col-6 col-md-3">
                    <div className="form-group">
                      <label>Marcador Local:</label>
                      <input
                        type="number"
                        className="form-control"
                        min={0}
                        value={marcador1}
                        onChange={(e) => setMarcador1(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Marcador Visitante */}
                  <div className="col-6 col-md-3">
                    <div className="form-group">
                      <label>Marcador Visitante:</label>
                      <input
                        type="number"
                        className="form-control"
                        min={0}
                        value={marcador2}
                        onChange={(e) => setMarcador2(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Equipo Visitante */}
                  <div className="col-12 col-md-3">
                    <div className="form-group">
                      <label htmlFor="equipo_visitante">Equipo Visitante:</label>
                      <select
                        id="equipo_visitante"
                        className="form-control"
                        value={String(equipoB_id)}
                        onChange={(e) => setEquipoVisitante(e.target.value)}
                        disabled={equipos.length === 0}
                      >
                        <option value="">
                          {equipos.length === 0 ? "Sin equipos" : "Selecciona Equipo"}
                        </option>
                        {equipos.map((eq) => (
                          <option key={eq.id} value={String(eq.id)}>
                            {eq.nombre || eq.name}
                          </option>
                        ))}
                      </select>
                      {errors.equipoB_id && <small className="text-danger d-block">{errors.equipoB_id}</small>}
                      {errors.equipos && <small className="text-danger d-block">{errors.equipos}</small>}
                    </div>
                  </div>

                  {/* Fecha y Hora */}
                  <div className="col-6 col-md-3">
                    <div className="form-group">
                      <label htmlFor="fecha">Fecha</label>
                      <input
                        id="fecha"
                        type="date"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="form-group">
                      <label htmlFor="hora">Hora</label>
                      <input
                        id="hora"
                        type="time"
                        className="form-control"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="form-group">
                      <label htmlFor="jornada">Jornada</label>
                      <input
                        id="jornada"
                        type="text"
                        className="form-control"
                        value={jornada}
                        onChange={(e) => setJornada(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="form-group">
                      <label htmlFor="sede">Sede</label>
                      <input
                        id="sede"
                        type="text"
                        className="form-control"
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMatchModal;