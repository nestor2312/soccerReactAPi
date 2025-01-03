/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const ModalEdit = ({ data, type, fields, onSave }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      // Inicializa el formData con los valores de data
      setFormData({ ...data });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualiza el valor del campo en el estado
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Filtra los campos vacíos obligatorios
    const emptyFields = fields.filter(
      (field) =>
        field.required &&
        (!formData[field.name] ||
          (typeof formData[field.name] === "string" && !formData[field.name].trim()))
    );

    if (emptyFields.length > 0) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // Llama a onSave con los datos actualizados
    onSave(formData);
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
            <form>
              {fields.map((field) => (
                <div className="mb-3" key={field.name}>
                  <label htmlFor={field.name} className="form-label">
                    {field.label}:
                  </label>
                  {field.type === "select" ? (
                    <select
                      className="form-select"
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
                      className="form-control"
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                    />
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
            >
              Cancelar
            </button>
            <button
              type="button"
              data-bs-dismiss="modal"
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
