/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const EditTeamModal = ({ team, onUpdate, grupos }) => {
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [GrupoID, setGrupoID] = useState("");

  useEffect(() => {
    if (team) { // Verifica si team tiene valor
      setNombre(team.nombre || "");
      setGrupoID(team.grupo_id || "");
      setArchivo(null); // Resetea el archivo
    }
  }, [team]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!team) return; // Agrega esta verificación
    onUpdate({
      id: team.id,
      nombre,
      grupo_id: GrupoID,
      archivo,
    });
  };

  return (
    <div
      className="modal fade"
      id="editModal"
      tabIndex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editModalLabel">
              Editar Equipo
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Nombre del equipo */}
              <div className="form-group">
                <label htmlFor="editNombre">Nombre del Equipo:</label>
                <input
                  type="text"
                  className="form-control"
                  id="editNombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {/* Selector de grupo */}
              <div className="form-group mt-3">
                <label htmlFor="editGrupo">Selecciona un grupo:</label>
                <select
                  id="editGrupo"
                  className="form-control"
                  value={GrupoID}
                  onChange={(e) => setGrupoID(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona un grupo
                  </option>
                  {grupos.map((grupo) => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nombre} - {grupo.subcategoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Input para el archivo */}
              <div className="form-group mt-3">
                <label htmlFor="editArchivo">Actualizar Archivo:</label>
                <input
                  type="file"
                  className="form-control"
                  id="editArchivo"
                  onChange={(e) => setArchivo(e.target.files[0])}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="submit"
               data-bs-dismiss="modal"
                className="btn btn-primary">
               Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeamModal;
