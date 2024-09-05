import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from '../../ConfigAPI';
const endpoint = `${API_ENDPOINT}partido`;
const equiposEndpoint = `${API_ENDPOINT}equipos`;
const FORM_Matches = () => {
  const [marcador1, setmarcador1] = useState("");
  const [marcador2, setmarcador2] = useState("");
  const [equipoLocalID, setequipoLocal] = useState("");
  const [equipoVisitanteID, setequipoVisitante] = useState("");

  const [equipos, setequipos] = useState([]);

  useEffect(() => {
    const fetchequipos = async () => {
      try {
        const response = await axios.get(equiposEndpoint);
        setequipos(response.data);
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };
    fetchequipos();
  }, []);

  const store = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("marcador1", marcador1);
    formData.append("marcador2", marcador2);
    formData.append("equipoA_id", equipoLocalID);
    formData.append("equipoB_id", equipoVisitanteID);
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

          <div className="input-field col-4 s12 m6">
              <label htmlFor="equipo_local" className="form-label">
                Selecciona Equipo Local
              </label>
              <select
                id="equipo_local"
                name="equipo_local"
                className="form-control validate required"
                onChange={(e) => setequipoLocal(e.target.value)}
                value={equipoLocalID}
              >
                <option value="" disabled>
                  Selecciona un Equipo
                </option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select> 

            </div>

            <div className="input-field col-2 s12 m6">
            <label>
                marcador
              </label>
              <input
                id="icon_prefix"
                name="marcador1"
                type="number"
                placeholder="marcador local"
                className="form-control validate required light-blue-text"
                onChange={(e) => setmarcador1(e.target.value)}
                value={marcador1}
              />
            </div>
  <div className="input-field col-2 s12 m6">
  <label>
                marcador
              </label>
              <input
                id="icon_prefix"
                name="marcador2"
                type="number"
                placeholder="marcador visitante"
                className="validate required light-blue-text"
                onChange={(e) => setmarcador2(e.target.value)}
                value={marcador2}
              />

  </div>

            <div className="input-field col-4 s12 m6">
              <label htmlFor="grupo_id" className="form-label">
                Selecciona un equipo
              </label>
              <select
                id="user_id"
                name="user_id"
                className="form-control validate required "
                onChange={(e) => setequipoVisitante(e.target.value)}
                value={equipoVisitanteID}
              >
                <option value="" disabled>
                  Selecciona un grupo
                </option>
                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="col s12 m12 mt-3">
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

export default FORM_Matches;
