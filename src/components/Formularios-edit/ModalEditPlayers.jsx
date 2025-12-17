/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import card_yellow from "../../assets/yellow-card.png";
import card_red from "../../assets/red-card.png";
const EditPlayerModal = ({ showModal, onClose, onSave, PlayerData, API_ENDPOINT }) => {
  // 📌 Campos que sí existen en la DB
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState(0);
  const [numero, setNumero] = useState(0);
  const [card_amarilla, setCardAmarilla] = useState(0);
  const [card_roja, setCardRoja] = useState(0);
  const [goles, setGoles] = useState(0);
  const [asistencias, setAsistencias] = useState(0);

  // 📌 Campos extra
  const [subcategoriaId, setSubcategoriaId] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [equipoId, setEquipoId] = useState("");   // equipo seleccionado
  const [equipos, setEquipos] = useState([]);     // lista de equipos

  // 🔹 Cargar datos iniciales cuando se abre el modal
  useEffect(() => {
    if (PlayerData) {
      setEquipoId(PlayerData.equipo_id || "");
      setNombre(PlayerData.nombre || "");
      setApellido(PlayerData.apellido || "");
      setEdad(PlayerData.edad || 0);
      setNumero(PlayerData.numero || 0);
      setCardAmarilla(PlayerData.card_amarilla || 0);
      setCardRoja(PlayerData.card_roja || 0);
      setGoles(PlayerData.goles || 0);
      setAsistencias(PlayerData.asistencias || 0);

      // Si el jugador ya tiene subcategoría, precargarla
      setSubcategoriaId(PlayerData.equipo?.grupo?.subcategoria?.id || "");
    }
  }, [PlayerData]);

  // 🔹 Cargar subcategorías al montar el modal
  useEffect(() => {
    if (showModal) {
      axios.get(`${API_ENDPOINT}subcategorias`)
        .then((res) => setSubcategorias(res.data)
      )
        .catch((err) => console.error("Error al obtener subcategorías:", err));
    }
  }, [showModal]);

  // 🔹 Cargar equipos cuando cambie subcategoría
  useEffect(() => {
    if (subcategoriaId) {
      axios.get(`${API_ENDPOINT}subcategoria/${subcategoriaId}/equipos`)
        .then((res) => setEquipos(res.data)
      )
        .catch((err) => console.error("Error al obtener equipos:", err));
    } else {
      setEquipos([]);
    }
  }, [subcategoriaId]);

  // Guardar solo lo que espera la DB
  const handleSave = () => {
    const updatedPlayer = {
      id: PlayerData.id,
      equipo_id: Number(equipoId),
      nombre,
      apellido,
      edad: Number(edad),
      numero: Number(numero),
      card_amarilla: Number(card_amarilla),
      card_roja: Number(card_roja),
      goles: Number(goles),
      asistencias: Number(asistencias),
    };
    onSave(updatedPlayer); 
     onClose();
  };

  if (!showModal) return null;

  return (
 <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" id="editModal" tabIndex="1">
          <div className="modal-header">
            <h5 className="modal-title">Editar Jugador</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
             <form autoComplete="off">
              <div className="container-fluid">
                <div className="row">
            {/* Subcategoría */}
            <div className="col-6 col-md-6 mb-3">
              <label htmlFor="subcategoria_id" className="form-label">Subcategoría</label>
              <select
                id="subcategoria_id"
                className="form-control"
                value={subcategoriaId}
                onChange={(e) => setSubcategoriaId(e.target.value)}
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategorias.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre} - {sub.categoria?.torneo?.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipo */}
            <div className="col-6 col-md-6 mb-3">
              <label htmlFor="equipo_id" className="form-label">Equipo</label>
              <select
                id="equipo_id"
                className="form-control"
                value={equipoId}
                onChange={(e) => setEquipoId(e.target.value)}
              >
                <option value="">Selecciona un equipo</option>
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Nombre */}
            <div className="col-6 col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            {/* Apellido */}
            <div className="col-6 col-md-6 mb-3">
              <label htmlFor="apellido" className="form-label">Apellido</label>
              <input
                type="text"
                id="apellido"
                className="form-control"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
              />
            </div>

            {/* Edad */}
            <div className=" col-3 col-md-3 mb-3">
              <label htmlFor="edad" className="form-label">Edad</label>
              <input
                type="number"
                id="edad"
                className="form-control"
                        min={5}
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
              />
            </div>

            {/* Número */}
            <div className="col-3 col-md-3 mb-3">
              <label htmlFor="numero" className="form-label">Número</label>
              <input
                type="number"
                id="numero"
                className="form-control"
                        min={1}
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>

            {/* Tarjetas Amarillas */}
            <div className="col-3 col-md-3 mb-3">
              <label htmlFor="card_amarilla" className="form-label">T. <span>
                                  <img className="card_red" src={card_yellow} alt="Tarjeta Amarilla" />
                                </span></label>
              <input
                type="number"
                id="card_amarilla"
                className="form-control"
                        min={0}
                value={card_amarilla}
                onChange={(e) => setCardAmarilla(e.target.value)}
              />
            </div>

            {/* Tarjetas Rojas */}
            <div className="col-3 col-md-3 mb-3">
              <label htmlFor="card_roja" className="form-label">T. <span>
                                  <img className="card_red" src={card_red} alt="Tarjeta Roja" />
                                </span></label>
              <input
                type="number"
                id="card_roja"
                className="form-control"
                        min={0}
                value={card_roja}
                onChange={(e) => setCardRoja(e.target.value)}
              />
            </div>

            {/* Goles */}
            <div className="col-3 col-md-3 mb-3">
              <label htmlFor="goles" className="form-label">Goles</label>
              <input
                type="number"
                id="goles"
                className="form-control"
                        min={0}
                value={goles}
                onChange={(e) => setGoles(e.target.value)}
              />
            </div>

            {/* Asistencias */}
            <div className="col-3 col-md-3 mb-3">
              <label htmlFor="asistencias" className="form-label">Asistencias</label>
              <input
                type="number"
                id="asistencias"
                className="form-control"
                        min={0}
                value={asistencias}
                onChange={(e) => setAsistencias(e.target.value)}
              />
            </div>
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerModal;
