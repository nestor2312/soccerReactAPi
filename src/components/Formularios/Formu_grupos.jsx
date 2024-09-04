import { useState } from "react";
import axios from "axios";
import "./index.css";
const endpoint = "https://hip-parts-nail.loca.lt/api/grupo";
const FORM_Groups = () => {
  const [Nombre, setNombre] = useState("");

  const store = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", Nombre);

    await axios.post(endpoint, formData, {});
  };

  return (
    <div className=" custom-card">
      <div className="row">
        <form className="col s12" onSubmit={store}>
          <div className="row">
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                nombre de grupo:
              </label>
              <input
                className="form-control"
                id="nombre"
                placeholder="ingrese el nombre del grupo"
                name="nombre"
                type="text"
                onChange={(e) => setNombre(e.target.value)}
                value={Nombre}
              />
            </div>

            <div className="col s12 m12">
              <button className="btn btn-outline-info" type="submit">
                Enviar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FORM_Groups;
