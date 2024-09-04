import { useEffect, useState } from "react";

import "./index.css";
import axios from "axios";

const endpoint = "http://127.0.0.1:8000/api/equipo";
const gruposEndpoint = "http://127.0.0.1:8000/api/grupos";

const FORM_PQR = () => {
  const [nombre, setnombre] = useState("");

  const [archivo, setArchivo] = useState(null);
  const [GrupoID, setGrupoID] = useState("");
  const [grupos, setgrupos] = useState([]);

  useEffect(() => {
    const fetchgrupos = async () => {
      try {
        const response = await axios.get(gruposEndpoint);
        setgrupos(response.data);
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
      }
    };
    fetchgrupos();
  }, []);

  const store = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("grupo_id", GrupoID);
    if (archivo) formData.append("archivo", archivo);

    try {
      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Datos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  };

  return (
    <div className=" custom-card">
      <div className="row">
        <form className="col s12" onSubmit={store}>
          <div className="row">
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                nombre de Equipo:
              </label>
              <input
                id="nombre"
                placeholder="ingrese el nombre del Equipo"
                name="nombre"
                type="text"
                className="form-control validate required light-blue-text"
                onChange={(e) => setnombre(e.target.value)}
                value={nombre}
              />
            </div>

            <div className="input-field col s12 m6">
              <label htmlFor="grupo_id" className="form-label">
                Selecciona un grupo
              </label>
              <select
                id="user_id"
                name="user_id"
                className="form-control validate required "
                onChange={(e) => setGrupoID(e.target.value)}
                value={GrupoID}
              >
                <option value="" disabled>
                  Selecciona un grupo
                </option>
                {grupos.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-field col s12 m6">
              <div className="mb-3">
                <label className="btn btn-primary">
                  añadir Archivo
                  <input
                    name="archivo"
                    type="file"
                    className="form-control d-none"
                    onChange={(e) => setArchivo(e.target.files[0])}
                  />
                </label>
              </div>
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

export default FORM_PQR;
