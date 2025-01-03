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

  const [torneoId, setTorneoId] = useState(matchData?.torneoId || "");
  const [categoriaId, setCategoriaId] = useState(matchData?.categoriaId || "");
  const [subcategoriaId, setSubcategoriaId] = useState(
    matchData?.subcategoriaId || ""
  );
  const [grupoId, setGrupoId] = useState(matchData?.grupoId || "");
  const [equipoLocalID, setEquipoLocal] = useState(
    matchData?.equipoLocalID || ""
  );
  const [equipoVisitanteID, setEquipoVisitante] = useState(
    matchData?.equipoVisitanteID || ""
  );
  const [marcador1, setMarcador1] = useState(matchData?.marcador1 || 0);
  const [marcador2, setMarcador2] = useState(matchData?.marcador2 || 0);

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
    const updatedMatch = {
      id: matchData?.id,
      equipoLocalID,
      equipoVisitanteID,
      marcador1,
      marcador2,
    };
    onSave(updatedMatch);
  };

  useEffect(() => {
    if (matchData) {
      setTorneoId(matchData.torneoId || "");
      setCategoriaId(matchData.categoriaId || "");
      setSubcategoriaId(matchData.subcategoriaId || "");
      setGrupoId(matchData.grupoId || "");
      setEquipoLocal(matchData.equipoLocalID || "");
      setEquipoVisitante(matchData.equipoVisitanteID || "");
      setMarcador1(matchData.marcador1 || 0);
      setMarcador2(matchData.marcador2 || 0);
    }
  }, [matchData]);

  if (!showModal) return null;

  return (
    <div className="modal z-index" style={{ display: "block" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Partido</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="modal-body">
            <form>
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
                    </div>
                  </div>

                  <div className="col-md-3 ml-auto ">
                    <div>
                      <label htmlFor="equipo_local">Equipo Local:</label>
                      <select
                        id="equipo_local"
                        className="form-control"
                        onChange={(e) => setEquipoLocal(e.target.value)}
                        value={equipoLocalID}
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
                        value={equipoVisitanteID}
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
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              data-bs-dismiss="modal">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMatchModal;
