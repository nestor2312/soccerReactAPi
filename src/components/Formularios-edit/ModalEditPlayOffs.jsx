/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const EditPlayOffsModal = ({ showModal, PlayOffsData, API_ENDPOINT, onSave, onClose }) => {
  const [subcategoria_id, setSubcategoriaId] = useState(PlayOffsData?.subcategoria_id || "");
  const [equipoLocal, setEquipoLocal] = useState(PlayOffsData?.equipo_a_id || "");
  const [equipoVisitante, setEquipoVisitante] = useState(PlayOffsData?.equipo_b || "");
  const [numPartido, setNumPartido] = useState(PlayOffsData?.numPartido || 0);
  const [tipo_eliminatoria, setTipoEliminatoria] = useState(PlayOffsData?.tipo_eliminatoria || "solo_ida");
  const [marcadores, setMarcadores] = useState(PlayOffsData?.marcadores || {
    marcador1_ida: null,
    marcador2_ida: null,
    marcador1_vuelta: null,
    marcador2_vuelta: null,
    marcador1_penales: null,
    marcador2_penales: null,
  });

  const [subcategorias, setSubcategorias] = useState([]);
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  
  useEffect(() => {
    if (PlayOffsData) {
      setSubcategoriaId(PlayOffsData.subcategoria_id || "");
      setEquipoLocal(PlayOffsData.equipo_a_id || "");
      setEquipoVisitante(PlayOffsData.equipo_b_id || "");
      setNumPartido(PlayOffsData.numPartido || 0);
      setTipoEliminatoria(PlayOffsData.tipo_eliminatoria || "solo_ida");
      setMarcadores({
        marcador1_ida: PlayOffsData.marcador1_ida ?? null,
        marcador2_ida: PlayOffsData.marcador2_ida ?? null,
        marcador1_vuelta: PlayOffsData.marcador1_vuelta ?? null,
        marcador2_vuelta: PlayOffsData.marcador2_vuelta ?? null,
        marcador1_penales: PlayOffsData.marcador1_penales ?? null,
        marcador2_penales: PlayOffsData.marcador2_penales ?? null,
      });
    }
  }, [PlayOffsData]);


  

  
  console.log('PlayOffsData recibido: ', PlayOffsData);

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const { data } = await axios.get(`${API_ENDPOINT}subcategorias`);
        setSubcategorias(data);
      } catch (error) {
        console.error("Error al obtener subcategorías:", error);
      }
    };
    fetchSubcategorias();
  }, [API_ENDPOINT]);

  useEffect(() => {
    if (subcategoria_id) {
      const fetchEquipos = async () => {
        try {
          const { data } = await axios.get(`${API_ENDPOINT}subcategoria/${subcategoria_id}/equipos`);
          if (Array.isArray(data)) setEquiposFiltrados(data);
        } catch (error) {
          console.error("Error al obtener equipos:", error);
        }
      };
      fetchEquipos();
    }
  }, [subcategoria_id, API_ENDPOINT]);
  

  const handleSave = () => {
    if (!subcategoria_id || !equipoLocal || !equipoVisitante || numPartido <= 0) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
    const updatedPlayOffs = {
      equipo_a_id: equipoLocal,
      equipo_b_id: equipoVisitante,
      subcategoria_id,
      numPartido,
      tipo_eliminatoria,
      ...marcadores,
      id: PlayOffsData?.id,
    };
    onSave(updatedPlayOffs);
    onClose();
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("marcador")) {
      setMarcadores((prev) => ({
        ...prev,
        [name]: value !== "" ? parseInt(value, 10) : null, // Si no se ingresa nada, lo dejamos como null
      }));
    } else {
      const handlers = {
        subcategoriaId: setSubcategoriaId,
        equipoLocal: setEquipoLocal,
        equipoVisitante: setEquipoVisitante,
        numPartido: setNumPartido,
        tipoEliminatoria: setTipoEliminatoria,
      };
      handlers[name](value);
    }
  };

  if (!showModal) return null;

  const mostrarCampo = (campo) => {
    if (campo === "ida") return tipo_eliminatoria !== "penales";
    if (campo === "vuelta") return tipo_eliminatoria === "ida_vuelta";
    if (campo === "penales") return tipo_eliminatoria === "penales";
  };

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar PlayOffs</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            {/* Subcategoría */}
            <div className="form-group">
              <label>Subcategoría</label>
              <select
                name="subcategoriaId"
                className="form-control"
                value={subcategoria_id}
                onChange={handleChange}
              >
                <option value="">Selecciona una subcategoría</option>
                {subcategorias.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field col s12 m6">
            <label>Número de Partido</label>
            <input
              id="numPartido"
              name="numPartido"
              type="number"
              placeholder="Número de Partido"
              className="form-control validate light-blue-text"
              onChange={handleChange}
              value={numPartido} />
          </div>
            {/* Equipos */}
            <div className="form-group">
              <label>Equipo Local</label>
              <select
                name="equipoLocal"
                className="form-control"
                value={equipoLocal}
                onChange={handleChange}
              >
                <option value="">Selecciona Equipo Local</option>
                {equiposFiltrados.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.nombre}
                  </option>
                ))}
              </select>

              <label>Equipo Visitante</label>
              <select
                name="equipoVisitante"
                className="form-control"
                value={equipoVisitante}
                onChange={handleChange}
              >
                <option value="">Selecciona Equipo Visitante</option>
                {equiposFiltrados.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo Eliminatoria */}
            <div className="form-group">
              <label>Tipo de Eliminatoria</label>
              <select
                name="tipoEliminatoria"
                className="form-control"
                value={tipo_eliminatoria}
                onChange={handleChange}
              >
                <option value="solo_ida">Solo Ida</option>
                <option value="ida_vuelta">Ida y Vuelta</option>
                <option value="penales">Penales</option>
              </select>
            </div>

            {/* Marcadores */}
            {mostrarCampo("ida") && (
              <>
                <label>Marcador Local (Ida)</label>
                <input
                  className="form-control"
                  name="marcador1_ida"
                  type="number"
                  min="0"
                  value={marcadores.marcador1_ida !== null ? marcadores.marcador1_ida : ""}
                  onChange={handleChange}
                />
                <label>Marcador Visitante (Ida)</label>
                <input
                  className="form-control"
                  name="marcador2_ida"
                  type="number"
                  min="0"
                  value={marcadores.marcador2_ida !== null ? marcadores.marcador2_ida : ""}
                  onChange={handleChange}
                />
              </>
            )}

            {mostrarCampo("vuelta") && (
              <>
                <label>Marcador Local (Vuelta)</label>
                <input
                  className="form-control"
                  name="marcador1_vuelta"
                  type="number"
                  min="0"
                  value={marcadores.marcador1_vuelta !== null ? marcadores.marcador1_vuelta : ""}
                  onChange={handleChange}
                />
                <label>Marcador Visitante (Vuelta)</label>
                <input
                  className="form-control"
                  name="marcador2_vuelta"
                  type="number"
                  min="0"
                  value={marcadores.marcador2_vuelta !== null ? marcadores.marcador2_vuelta : ""}
                  onChange={handleChange}
                />
              </>
            )}

            {mostrarCampo("penales") && (
              <>
                <label>Penales Local</label>
                <input
                  className="form-control"
                  name="marcador1_penales"
                  type="number"
                  min="0"
                  value={marcadores.marcador1_penales !== null ? marcadores.marcador1_penales : ""}

                  onChange={handleChange}
                />
                <label>Penales Visitante</label>
                <input
                  className="form-control"
                  name="marcador2_penales"
                  type="number"
                  min="0"
                  value={marcadores.marcador2_penales !== null ? marcadores.marcador2_penales : ""}

                  onChange={handleChange}
                />
              </>
            )}

            {/* Botón Guardar */}
            <button className="btn btn-primary mt-3" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlayOffsModal;