/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";

const MatchEventsModal = ({
  showModal,
  partidoId,
  API_ENDPOINT,
  onClose,
}) => {
  const [eventos, setEventos] = useState([]);
  
const [equipos, setEquipos] = useState([]);
const [jugadores, setJugadores] = useState([]);

  // form
  const [tipo, setTipo] = useState("");
  const [minuto, setMinuto] = useState("");
  const [jugadorId, setJugadorId] = useState("");
  const [jugadorOutId, setJugadorOutId] = useState("");
  const [equipoId, setEquipoId] = useState("");

  const [errors, setErrors] = useState({});

  // -----------------------
  // Cargar eventos del partido
  // -----------------------
  useEffect(() => {
    if (!showModal || !partidoId) return;

     setEventos([]);
  setEquipos([]);
  setJugadores([]);
  setEquipoId("");
  setJugadorId("");

    const fetchEventos = async () => {
      try {
        const res = await axios.get(
          `${API_ENDPOINT}partidos/${partidoId}/eventos`
        );
        setEventos(res.data || []);
      } catch (err) {
        console.error("Error cargando eventos:", err);
      }
    };

const fetchEquipos = async () => {
  try {
    const res = await axios.get(`${API_ENDPOINT}partidos/${partidoId}/jugadores`);
    
    // Solo actualizamos si ambos equipos existen en la respuesta
    if (res.data.equipoA && res.data.equipoB) {
      setEquipos([res.data.equipoA, res.data.equipoB]);
    } else {
      console.warn("La API no devolvió los dos equipos", res.data);
    }
  } catch (err) {
    console.error("Error cargando equipos:", err);
  }
};


    fetchEventos();
    fetchEquipos();
  }, [showModal, partidoId, API_ENDPOINT]);

  // -----------------------
  // Validación
  // -----------------------
  const validate = () => {
    let newErrors = {};
    if (!tipo) newErrors.tipo = "Selecciona el tipo";
    // if (!minuto) newErrors.minuto = "Minuto obligatorio";
    if (!jugadorId) newErrors.jugadorId = "Selecciona un jugador";
    if (tipo === "cambio" && !jugadorOutId)
      newErrors.jugadorOutId = "Selecciona el jugador que sale";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------
  // Crear evento
  // -----------------------
  const handleCreate = async () => {
    if (!validate()) return;

    try {
     // BIEN: usando la variable partidoId
await axios.post(`${API_ENDPOINT}partidos/${partidoId}/eventos`, {
  partido_id: partidoId, // opcional si ya va en la URL
  tipo_evento: tipo,     // nombre exacto de tu validación en Laravel
  minuto: minuto,
  jugador_id: jugadorId,
  equipo_id: equipoId,
});

      // refrescar lista
      const res = await axios.get(
        `${API_ENDPOINT}partidos/${partidoId}/eventos`
      );
      setEventos(res.data || []);

      // reset
      setTipo("");
      setMinuto("");
      setJugadorId("");
      setJugadorOutId("");
      setEquipoId("");
      setErrors({});
    } catch (err) {
      console.error("Error creando evento:", err);
    }
  };

  // -----------------------
  // Eliminar evento
  // -----------------------
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar evento?")) return;

    try {
      await axios.delete(`${API_ENDPOINT}eventos/${id}`);
      setEventos(eventos.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error eliminando evento:", err);
    }
  };

  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Eventos del Partido</h5>
            <button className="close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="modal-body">
            {/* FORM */}
            <div className="row">
              <div className="col-md-3">
                <label>Tipo</label>
                <select
                  className="form-control"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  <option value="">Selecciona</option>
                  <option value="gol">⚽ Gol</option>
                  <option value="amarilla">🟨 Amarilla</option>
                  <option value="roja">🟥 Roja</option>
                  <option value="asistencia">🎯 Asistencia</option>
                </select>
                {errors.tipo && <small className="text-danger">{errors.tipo}</small>}
              </div>

              <div className="col-md-2">
                <label>Minuto</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={minuto}
                  onChange={(e) => setMinuto(e.target.value)}
                />
                {errors.minuto && <small className="text-danger">{errors.minuto}</small>}
              </div>

              <div className="col-md-3">
  <label>Equipo</label>
  <select
    className="form-control"
    value={equipoId}
    onChange={(e) => {
      const id = e.target.value;
      setEquipoId(id);

      const equipo = equipos.find(eq => eq.id == id);
      setJugadores(equipo ? equipo.jugadores : []);
      setJugadorId("");
    }}
  >
    <option value="">Selecciona</option>
    {equipos.map((e) => (
      <option key={e.id} value={e.id}>
        {e.nombre}
      </option>
    ))}
  </select>
</div>


              <div className="col-md-3">
                <label>Jugador</label>
             <select
  className="form-control"
  value={jugadorId}
  onChange={(e) => setJugadorId(e.target.value)}
  disabled={!equipoId}
>
  <option value="">Selecciona</option>
  {jugadores.map((j) => (
    <option key={j.id} value={j.id}>
      {j.nombre}
    </option>
  ))}
</select>

                {errors.jugadorId && (
                  <small className="text-danger">{errors.jugadorId}</small>
                )}
              </div>

              {tipo === "cambio" && (
                <div className="col-md-3">
                  <label>Jugador sale</label>
                  <select
                    className="form-control"
                    value={jugadorOutId}
                    onChange={(e) => setJugadorOutId(e.target.value)}
                  >
                    <option value="">Selecciona</option>
                    {jugadores.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.jugadorOutId && (
                    <small className="text-danger">{errors.jugadorOutId}</small>
                  )}
                </div>
              )}

              <div className="col-md-1 d-flex align-items-end">
                <button className="btn btn-primary" onClick={handleCreate}>
                  +
                </button>
              </div>
            </div>

            <hr />

            {/* LISTA DE EVENTOS */}
            <table className="table table-sm table-bordered">
              <thead>
                <tr>
                  <th>Min</th>
                  <th>Equipo</th>
                  <th>Tipo</th>
                  <th>Jugador</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {eventos.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Sin eventos
                    </td>
                  </tr>
                )}
              {eventos.map((e) => (
  <tr key={e.id}>
    {/* Agregamos de nuevo el minuto */}
   <td>{e.minuto ? `${e.minuto}'` : '-'}</td>
   <td>
        <span className="" style={{border: '1px solid #ddd'}}>
          {e.equipo?.nombre || 'N/A'}
        </span>
      </td>
    <td>
      {e.tipo_evento === 'gol' && '⚽ '}
      {e.tipo_evento === 'amarilla' && '🟨 '}
      {e.tipo_evento === 'roja' && '🟥 '}
      {e.tipo_evento === 'asistencia' && '👟'}
      <span className="text-capitalize">{e.tipo_evento}</span>
    </td>
    <td>{e.jugador?.nombre}</td>
    <td width="60">
      <button
        className="btn btn-danger btn-sm"
        onClick={() => handleDelete(e.id)}
      >
        ✕
      </button>
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchEventsModal;
