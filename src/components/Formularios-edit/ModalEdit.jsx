/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const ModalEdit = ({ data, type, fields, onSave }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Si es un campo numérico, restringe a 2 caracteres y solo números
    let newValue = value;
    if (type === "number") {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 2);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Limpiar el error cuando el usuario modifica el valor
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = () => {
    let hasErrors = false;
    let newErrors = {};

    // Validar campos
    fields.forEach((field) => {
      const value = formData[field.name];

      // Validar si es obligatorio y está vacío
      if (field.required && (!value || (typeof value === "string" && !value.trim()))) {
        newErrors[field.name] = "Este campo es obligatorio";
        hasErrors = true;
      }

      // Validar campos numéricos
      if (field.type === "number") {
        if (value && (value < field.min || value > field.max)) {
          newErrors[field.name] = `El numero de clasificados debe estar entre ${field.min} y ${field.max}`;
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return; // No enviar 
    }

    // Si no hay errores, guardar 
    onSave(formData);
    setErrors({});
    document.getElementById("closeModalButton").click(); 
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
              Editar {type}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form autoComplete="off">
              {fields.map((field) => (
                <div className="mb-3" key={field.name}>
                  <label htmlFor={field.name} className="form-label">
                    {field.label}:
                  </label>
                  {field.type === "select" ? (
                    <select
                      className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                    >
                      <option value="">Seleccionar...</option>
                      {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      maxLength={field.type === "number" ? "2" : undefined}
                      inputMode={field.type === "number" ? "numeric" : undefined} 
                    />
                  )}
                  {errors[field.name] && (
                    <div className="invalid-feedback">{errors[field.name]}</div>
                  )}
                </div>
              ))}
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              data-bs-dismiss="modal"
              id="closeModalButton"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;
