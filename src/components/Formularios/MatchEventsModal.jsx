/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";

const MatchEventsModal = ({
  showModal,
  partidoId,
  eliminatoriaId,
  instancia = "normal",
  API_ENDPOINT,
  onClose,
}) => {
  const [eventos, setEventos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [tipo, setTipo] = useState("");
  const [minuto, setMinuto] = useState("");
  const [jugadorId, setJugadorId] = useState("");
  const [equipoId, setEquipoId] = useState("");
  const [errors, setErrors] = useState({});

  const activeId = eliminatoriaId || partidoId;
  const isEliminatoria = !!eliminatoriaId;

  // Iconos para la tabla
  const getEventoIcon = (tipo) => {
    switch (tipo) {
      case "gol": return "⚽";
      case "gol_penal": return "✅";
      case "fallo_penal": return "❌";
      case "amarilla": return "🟨";
      case "roja": return "🟥";
      case "asistencia": return "👟";
      default: return "";
    }
  };

  useEffect(() => {
    if (!showModal || !activeId) return;

    // Resetear estados al abrir para evitar ver datos del partido anterior
    setEventos([]);
    setEquipos([]);
    setJugadores([]);
    setEquipoId("");
    setJugadorId("");

    const fetchData = async () => {
      // 1. Cargar Eventos
   try {
    // Intentamos enviar ambos IDs en los params para que el backend los vea
    const resEventos = await axios.get(`${API_ENDPOINT}partidos/${activeId}/eventos`, {
      params: {
        partido_id: !isEliminatoria ? activeId : null,
        eliminatoria_id: isEliminatoria ? activeId : null,
        instancia: instancia 
      }
    });

   
    setEventos(resEventos.data || []);
  } catch (err) {
    console.error("Error cargando eventos:", err);
  }

      // 2. Cargar Equipos y Jugadores (Lógica flexible para equipos NULL)
      try {
        const resEquipos = await axios.get(
          `${API_ENDPOINT}partidos/${activeId}/jugadores`,
          { params: { tipo: isEliminatoria ? "eliminatoria" : "liga" } }
        );

        const data = resEquipos.data;
        
        // Mapeo flexible: intenta leer equipoA, equipo_a o equipo_aa
        const eqA = data.equipoA || data.equipo_a || data.equipo_aa;
        const eqB = data.equipoB || data.equipo_b;

        // FILTRO CLAVE: Creamos la lista solo con los equipos que NO son null
        const equiposValidos = [eqA, eqB].filter(e => e !== null && e !== undefined && e.id);
        
        setEquipos(equiposValidos);
      } catch (err) {
        console.error("Error cargando equipos/jugadores:", err);
        setEquipos([]);
      }
    };

    fetchData();
  }, [showModal, activeId, instancia, isEliminatoria, API_ENDPOINT]);

  const validate = () => {
    let newErrors = {};
    if (!tipo) newErrors.tipo = "Obligatorio";
    if (!jugadorId) newErrors.jugadorId = "Obligatorio";
    if (!equipoId) newErrors.equipoId = "Obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    try {
      const payload = {
        tipo_evento: tipo,
        minuto: minuto || null,
        jugador_id: jugadorId,
        equipo_id: equipoId,
        instancia: instancia,
        [isEliminatoria ? "eliminatoria_id" : "partido_id"]: activeId,
      };

      // POST a la ruta: /api/partidos/{id}/eventos
      const res = await axios.post(`${API_ENDPOINT}partidos/${activeId}/eventos`, payload);

      // Agregar el nuevo evento a la lista local
      setEventos((prev) => [...prev, res.data]);

      // Limpiar el formulario
      setTipo("");
      setMinuto("");
      setJugadorId("");
      setEquipoId("");
      setErrors({});
    } catch (err) {
      console.error("Error al crear el evento:", err);
      alert("Error al guardar el evento. Verifica la conexión.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este evento?")) return;
    try {
      // Asumiendo que tienes una ruta genérica para borrar eventos por ID
      await axios.delete(`${API_ENDPOINT}eventos/${id}`);
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error eliminando evento:", err);
    }
  };

  // Filtrar por instancia (Normal o Penales) y ordenar por minuto
  const eventosFiltrados = eventos
    .filter((e) => e.instancia === instancia)
    .sort((a, b) => (parseInt(a.minuto) || 0) - (parseInt(b.minuto) || 0));

  if (!showModal) return null;

  return (
    <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content   shadow-lg">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              Registro de Eventos: {instancia.replace("_", " ")}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Formulario de registro rápido */}
            <div className="row g-2 p-3 bg-light rounded mb-4 border">
              <div className="col-md-3">
                <label className="form-label small fw-bold">Tipo</label>
                <select className={`form-select ${errors.tipo ? 'is-invalid' : ''}`} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="">Selecciona</option>
                  {instancia !== "tanda_penales" ? (
                    <>
                      <option value="gol">⚽ Gol</option>
                      <option value="amarilla">🟨 Amarilla</option>
                      <option value="roja">🟥 Roja</option>
                      <option value="asistencia">👟 Asistencia</option>
                    </>
                  ) : (
                    <>
                      <option value="gol_penal">✅ Gol Penal</option>
                      <option value="fallo_penal">❌ Fallado</option>
                    </>
                  )}
                </select>
              </div>

              {instancia !== "tanda_penales" && (
                <div className="col-md-2">
                  <label className="form-label small fw-bold">Minuto</label>
                  <input type="number" className="form-control" value={minuto} onChange={(e) => setMinuto(e.target.value)} placeholder="Ej: 45" />
                </div>
              )}

              <div className="col-md-3">
                <label className="form-label small fw-bold">Equipo</label>
             <select 
  className={`form-select ${errors.equipoId ? 'is-invalid' : ''}`} 
  value={equipoId} 
  onChange={(e) => {
    const id = e.target.value;
    setEquipoId(id);
    const eq = equipos.find(q => String(q.id) === String(id)); // Comparación segura de strings
    setJugadores(eq ? eq.jugadores : []);
    setJugadorId("");
  }}
>
  <option value="">
    {equipos.length === 0 ? "Por definir..." : "Selecciona equipo"}
  </option>
  {equipos.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
</select>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-bold">Jugador</label>
                <select className={`form-select ${errors.jugadorId ? 'is-invalid' : ''}`} value={jugadorId} onChange={(e) => setJugadorId(e.target.value)} disabled={!equipoId}>
                  <option value="">Selecciona</option>
                  {jugadores.map(j => <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>)}
                </select>
              </div>

              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-primary w-100 fw-bold" onClick={handleCreate}>+</button>
              </div>
            </div>

            {/* Tabla de eventos registrados */}
            <div className="table-responsive" style={{ maxHeight: "350px" }}>
              <table className="table table-sm table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th className="text-center">Min</th>
                    <th>Equipo</th>
                    <th>Evento</th>
                    <th>Jugador</th>
                    <th className="text-end"></th>
                  </tr>
                </thead>
                <tbody>
                  {eventosFiltrados.map((e) => (
                    <tr key={e.id}>
                      <td className="text-center fw-bold">{e.minuto ? `${e.minuto}'` : "-"}</td>
                      <td><span className="badge bg-secondary">{e.equipo?.nombre}</span></td>
                      <td>
                        {getEventoIcon(e.tipo_evento)} <span className="text-capitalize small">{e.tipo_evento.replace("_", " ")}</span>
                      </td>
                      <td>{e.jugador ? `${e.jugador.nombre} ${e.jugador.apellido}` : 'Desconocido'}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger  " onClick={() => handleDelete(e.id)}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {eventosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">No hay eventos registrados en esta instancia.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="modal-footer bg-light">
            <button className="btn btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchEventsModal;