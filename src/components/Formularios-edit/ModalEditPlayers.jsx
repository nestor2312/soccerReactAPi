/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import axios from 'axios';

const EditPlayerModal = ({ showModal, PlayerData, API_ENDPOINT, onSave, onClose }) => {
  const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

  const [subcategoriaId, setSubcategoriaId] = useState(PlayerData?.subcategoriaId || "");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(PlayerData?.equipoId || "");
  const [nombre, setNombre] = useState(PlayerData?.nombre || "");
  const [apellido, setApellido] = useState(PlayerData?.apellido || "");
  const [edad, setEdad] = useState(PlayerData?.edad || 0);
  const [numero, setNumero] = useState(PlayerData?.numero || 0);
  const [card_amarilla, setcard_amarilla] = useState(PlayerData?.card_amarilla || 0);
  const [card_roja, setcard_roja] = useState(PlayerData?.card_roja || 0);
  const [goles, setgoles] = useState(PlayerData?.goles || 0);
  const [asistencias, setasistencias] = useState(PlayerData?.asistencias || 0);
  // eslint-disable-next-line no-unused-vars
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    console.log('PlayerData recibido: ', PlayerData);
    setSubcategoriaId(PlayerData?.subcategoriaId || "");
    setEquipoSeleccionado(PlayerData?.equipoId || "");
    setNombre(PlayerData?.nombre || "");
    setApellido(PlayerData?.apellido || "");
    setEdad(PlayerData?.edad || 0);
    setNumero(PlayerData?.numero || 0);
    setcard_amarilla(PlayerData?.card_amarilla || 0);
    setcard_roja(PlayerData?.card_roja || 0);
    setgoles(PlayerData?.goles || 0);
    setasistencias(PlayerData?.asistencias || 0);
  }, [PlayerData]);
  

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
  }, [subcategoriasEndpoint]);

  useEffect(() => {
    const fetchEquiposPorSubcategoria = async () => {
      if (subcategoriaId) {
        try {
          const response = await axios.get(`${API_ENDPOINT}subcategoria/${subcategoriaId}/equipos`);
          setEquiposFiltrados(response.data);
        } catch (error) {
          console.error("Error al obtener los equipos por subcategoría:", error);
        }
      }
    };

    fetchEquiposPorSubcategoria();
  }, [subcategoriaId, API_ENDPOINT]);

  const handleSave = () => {
    const updatedPlayer = {
      id: PlayerData?.id,
      equipo_id: equipoSeleccionado,
      nombre,
      apellido,
      edad,
      numero,
      card_amarilla,
      card_roja,
      goles,
      asistencias
    };
    onSave(updatedPlayer);
  };

  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Jugador</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            
            <div className="container-fluid">
            <div className="row">
            <div className="col-md-6 ml-auto ">

            <div className="form-group">
                <label htmlFor="subcategoria_id">Subcategoría:</label>
                <select
                  id="subcategoria_id"
                  className="form-control"
                  value={subcategoriaId}
                  onChange={(e) => setSubcategoriaId(e.target.value)}
                >
                  <option value="" disabled>
                    {subcategorias.length === 0 ? "Cargando..." : "Selecciona una subcategoría"}
                  </option>
                  {subcategorias.map((subcategoria) => (
                    <option key={subcategoria.id} value={subcategoria.id}>
                      {subcategoria.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6 ml-auto ">

              <div className="form-group">
                <label htmlFor="equipo_id">Equipo:</label>
                <select
                  id="equipo_id"
                  className="form-control"
                  value={equipoSeleccionado}
                  onChange={(e) => setEquipoSeleccionado(e.target.value)}
                >
                  <option value="" disabled>
                    {equiposFiltrados.length === 0 ? "Cargando..." : "Selecciona un equipo"}
                  </option>
                  {equiposFiltrados.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>


              <div className="col-md-6 ml-auto">
                <div>
                  <label>Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Apellido:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Apellido"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Edad:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                    placeholder="Edad"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Número:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    placeholder="Número"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Tarjeta Amarilla:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={card_amarilla}
                    onChange={(e) => setcard_amarilla(e.target.value)}
                    placeholder="Tarjeta Amarilla"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Tarjeta Roja:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={card_roja}
                    onChange={(e) => setcard_roja(e.target.value)}
                    placeholder="Tarjeta Roja"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Goles:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={goles}
                    onChange={(e) => setgoles(e.target.value)}
                    placeholder="Goles"
                  />
                </div>
              </div>
              <div className="col-md-6 ml-auto">
                <div>
                  <label>Asistencias:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={asistencias}
                    onChange={(e) => setasistencias(e.target.value)}
                    placeholder="Asistencias"
                  />
                </div>
              </div>
              </div>
              </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            <button type="button"    data-bs-dismiss="modal" className="btn btn-primary" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EditPlayerModal;
