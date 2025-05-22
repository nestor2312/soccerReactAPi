/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

const EditTeamModal = ({ team, onUpdate, grupos }) => {
  const [nombre, setNombre] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [GrupoID, setGrupoID] = useState("");
  const [errors, setErrors] = useState({}); // Estado para manejar errores

  useEffect(() => {
    if (team) {
      setNombre(team.nombre || "");
      setGrupoID(team.grupo_id || "");
      setArchivo(null);
      setErrors({}); // Reiniciar errores al abrir el modal
    }
  }, [team]);

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validación del nombre
    if (!nombre.trim()) {
      newErrors.nombre = "El nombre del equipo es obligatorio.";
      isValid = false;
    }

    // Validación del grupo
    if (!GrupoID) {
      newErrors.GrupoID = "Debes seleccionar un grupo.";
      isValid = false;
    }

    // Validación del archivo (si se selecciona)
    if (archivo) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(archivo.type)) {
        newErrors.archivo = "Solo se permiten imágenes (JPG, JPEG, PNG).";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!team) return;

    if (!validateForm()) return; // Si hay errores, no enviar el formulario

    onUpdate({
      id: team.id,
      nombre,
      grupo_id: GrupoID,
      archivo,
    });

    document.getElementById("closeModalButton").click(); // Cierra el modal si todo está bien
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
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="modal-body">
              {/* Nombre del equipo */}
              <div className="form-group">
                <label htmlFor="editNombre">Nombre del Equipo:</label>
                <input
                  type="text"
                  className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                  id="editNombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
              </div>

              {/* Selector de grupo */}
              <div className="form-group mt-3">
                <label htmlFor="editGrupo">Selecciona un grupo:</label>
                <select
                  id="editGrupo"
                  className={`form-control ${errors.GrupoID ? "is-invalid" : ""}`}
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
                {errors.GrupoID && <div className="invalid-feedback">{errors.GrupoID}</div>}
              </div>

              {/* Input para el archivo */}
              <div className="form-group mt-3">
                <label htmlFor="editArchivo">Actualizar Archivo:</label>
                <input
                  type="file"
                  className={`form-control ${errors.archivo ? "is-invalid" : ""}`}
                  id="editArchivo"
                  onChange={(e) => setArchivo(e.target.files[0])}
                />
                {errors.archivo && <div className="invalid-feedback">{errors.archivo}</div>}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
                id="closeModalButton"
              >
                Cerrar
              </button>
              <button type="submit" className="btn btn-primary">
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
