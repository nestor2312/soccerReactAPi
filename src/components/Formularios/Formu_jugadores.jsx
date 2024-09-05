import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from '../../ConfigAPI';

const endpoint = `${API_ENDPOINT}jugador`;
const equiposEndpoint = `${API_ENDPOINT}equipos`;

const FORM_Players = () => {

  const [equipoID, setequipo] = useState("");
  const [nombre, setnombre] = useState("");
  const [apellido, setapellido] = useState("");
  const [edad, setedad] = useState("");
  const [numero, setnumero] = useState("");
  const [card_amarilla, setcard_amarilla] = useState("");
  const [card_roja, setcard_roja] = useState("");
  
  
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
    formData.append("equipo_id", equipoID);
    formData.append("nombre", nombre);
    formData.append("apellido", apellido);
    formData.append("edad", edad);
    formData.append("numero", numero);
    formData.append("card_amarilla", card_amarilla);
    formData.append("card_roja", card_roja);
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
                Selecciona Equipo
              </label>
              <select
                id="equipo_local"
                name="equipo_local"
                className="form-control validate required"
                onChange={(e) => setequipo(e.target.value)}
                value={equipoID}
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
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                nombre de Jugador:
              </label>
              <input
                id="nombre"
                placeholder="ingrese el nombre del jugador"
                name="nombre"
                type="text"
                className="form-control validate required light-blue-text"
                onChange={(e) => setnombre(e.target.value)}
                value={nombre}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                apellido:
              </label>
              <input
                id="nombre"
                placeholder="ingrese el apellido del jugador"
                name="apellido"
                type="text"
                className="form-control validate required light-blue-text"
                onChange={(e) => setapellido(e.target.value)}
                value={apellido}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                edad:
              </label>
              <input
                id="nombre"
                placeholder="ingrese la edad del jugador"
                name="edad"
                type="number"
                maxLength={2}
                className="form-control validate required light-blue-text"
                onChange={(e) => setedad(e.target.value)}
                value={edad}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                numero:
              </label>
              <input
                id="nombre"
                placeholder="ingrese numero del jugador"
                name="numero"
                type="number"
                max={2}
                className="form-control validate required light-blue-text"
                onChange={(e) => setnumero(e.target.value)}
                value={numero}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                Tarjetas amarillas:
              </label>
              <input
                id="nombre"
                placeholder="ingrese la cantidad de tarjetas"
                name="nombre"
                type="number"
                className="form-control validate required light-blue-text"
                onChange={(e) => setcard_amarilla(e.target.value)}
                value={card_amarilla}
              />
            </div>
            <div className="mb-3 mt-3">
              <label htmlFor="nombre" className="form-label">
                Tarjetas rojas:
              </label>
              <input
                id="nombre"
                placeholder="ingrese la cantidad de tarjetas"
                name="nombre"
                type="number"
                className="form-control validate required light-blue-text"
                onChange={(e) => setcard_roja(e.target.value)}
                value={card_roja}
              />
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

export default FORM_Players;
