/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from '../../ConfigAPI';
import "./index.css"

import ModalJugadores from "../Formularios-edit/ModalEditPlayers";
import card_red from "../../assets/yellow-card.png"
import card_yellow from "../../assets/red-card.png"


const endpoint = `${API_ENDPOINT}jugador`;
const equiposEndpoint = `${API_ENDPOINT}equipos`;
const InfoJugadores_endpoint = `${API_ENDPOINT}jugadores`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;
const FORM_Players = () => {

const[Jugadores, setJugadores] = useState([])

const [SubcategoriaID, setSubcategoriaID] = useState("");
const [subcategorias, setSubcategorias] = useState([]);
  const [equipoID, setequipo] = useState("");
  const [nombre, setnombre] = useState("");
  const [apellido, setapellido] = useState("");
  const [edad, setedad] = useState("");
  const [numero, setnumero] = useState("");
  const [card_amarilla, setcard_amarilla] = useState("");
  const [goles, setgoles] = useState("");
  const [asistencias, setasistencias] = useState("");
  const [card_roja, setcard_roja] = useState("");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [equipos, setequipos] = useState([]);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const [selectedJugador, setSelectedJugador] = useState(null); 
  const [showModal, setShowModal] = useState(false);


  // eslint-disable-next-line no-unused-vars
  const handleEditClick = (jugador) => {
    setSelectedJugador(jugador); // Asignar los datos del partido al estado
    setShowModal(true); // Mostrar el modal
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedJugador(null); // Limpiar los datos del partido
  };

   // Eliminar jugador
   const deleteJugadores = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este jugador?")) {
      try {
        await axios.delete(`${API_ENDPOINT}jugador/${id}`);
        // Actualizar lista de jugadores
        setAlerta({ mensaje: "jugador eliminado correctamente!", tipo: "success" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
        const response = await axios.get(`${API_ENDPOINT}jugadores`);
        setJugadores(response.data);
      } catch (error) {
        console.error("Error al eliminar el jugador:", error);
      }
    }
  };
  



  
  const saveJugador = async (updatedJugador) => {
    console.log('datos enviados al back son : ', updatedJugador);
    try {
      await axios.put(`${API_ENDPOINT}jugador/${updatedJugador.id}`, updatedJugador);
      ListaInfojugadores()
      setAlerta({ mensaje: "jugador actualizado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      

    } catch (error) {
      console.error("Error al actualizar jugador:", error);
      setAlerta({ mensaje: "Error al actualizar jugador!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    }
  };


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

    ListaInfojugadores();
  }, []);
  const ListaInfojugadores = async ()=>{
    try {
      const response = await axios.get(InfoJugadores_endpoint);
      setJugadores(response.data);
    } catch (error) {
      console.error("Error al obtener los jugadores:", error);
      
    }
  }

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
    formData.append("goles", goles);
    formData.append("asistencias", asistencias);
    try {
      await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      ListaInfojugadores()
      setAlerta({ mensaje: "Jugador registrado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
    
    
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setAlerta({ mensaje: "Error Equipo registrar el Jugador.", tipo: "danger" });
    }
  };

  
  useEffect(() => {

    const fetchSubcategorias = async () => {
      try {
        const response = await axios.get(subcategoriasEndpoint);

        setSubcategorias(response.data);
      } catch (error) {
        console.error("Error al obtener las subcategorías:", error);
      }
    };
    
    fetchSubcategorias();
  
  }, []);
  useEffect(() => {
    const fetchEquiposPorSubcategoria = async () => {
      if (SubcategoriaID) {
        try {
          const response = await axios.get(`${API_ENDPOINT}subcategoria/${SubcategoriaID}/equipos`);
          setEquiposFiltrados(response.data); // Actualiza el estado con los equipos filtrados
        } catch (error) {
          console.error("Error al obtener los equipos por subcategoría:", error);
        }
      }
    };
    fetchEquiposPorSubcategoria();
  }, [SubcategoriaID]);
  


  useEffect(() => {
    document.title = "Admin - Jugadores";
  }, []);

  return (
    <div>
         {alerta.mensaje && (
  <div className={`alert alert-${alerta.tipo} alert-dismissible fade show`} role="alert">
    {alerta.mensaje}
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="alert"
      aria-label="Close"
      onClick={() => setAlerta({ mensaje: "", tipo: "" })}
    ></button>
  </div>
)}
       <h1 className="text-left">Registro de Jugadores</h1>
      <div>

      <div className="form-group mt-3">
            <label htmlFor="subcategoria_id">
              Selecciona una Subcategoría:
            </label>

            <select
              id="subcategoria_id"
              className="form-control"
              value={SubcategoriaID}
              onChange={(e) => setSubcategoriaID(e.target.value)}
            >
              <option value="" disabled>
                Selecciona una subcategoría
              </option>

              {subcategorias.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id}>
                  {subcategoria.nombre}
                </option>
              ))}
            </select>
          </div>
    
        <form className="col s12" onSubmit={store}>
          <div className="row">

          <div className="input-field col-4 s12 m6">
              <label htmlFor="equipo_nombre" className="form-label">
                Selecciona Equipo
              </label>
              <select
                id="equipo_nombre"
                name="equipo_nombre"
                className="form-control validate required"
                onChange={(e) => setequipo(e.target.value)}
                value={equipoID}
              >
                <option value="" disabled>
                  Selecciona un Equipo
                </option>
                {equiposFiltrados.map((equipo) => (
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
  <label htmlFor="edad" className="form-label">
    Edad:
  </label>
  <input
    id="edad"
    placeholder="Ingrese la edad del jugador"
    name="edad"
    type="number"
    min={1}
    max={50} 
    className="form-control validate required light-blue-text"
    onChange={(e) => setedad(e.target.value)}
    value={edad}
    required
  />
</div>

<div className="mb-3 mt-3">
  <label htmlFor="numero" className="form-label">
    Número:
  </label>
  <input
    id="numero"
    placeholder="Ingrese el número del jugador"
    name="numero"
    type="number"
    min={1}
    max={99} 
    className="form-control validate required light-blue-text"
    onChange={(e) => setnumero(e.target.value)}
    value={numero}
    required
  />
</div>

<div className="mb-3 mt-3">
  <label htmlFor="card_amarilla" className="form-label">
    Tarjetas amarillas:
  </label>
  <input
    id="card_amarilla"
    placeholder="Ingrese la cantidad de tarjetas amarillas"
    name="card_amarilla"
    type="number"
    min={0}
    className="form-control validate required light-blue-text"
    onChange={(e) => setcard_amarilla(e.target.value)}
    value={card_amarilla}
    required
  />
</div>

<div className="mb-3 mt-3">
  <label htmlFor="card_roja" className="form-label">
    Tarjetas rojas:
  </label>
  <input
    id="card_roja"
    placeholder="Ingrese la cantidad de tarjetas rojas"
    name="card_roja"
    type="number"
    min={0}
    className="form-control validate required light-blue-text"
    onChange={(e) => setcard_roja(e.target.value)}
    value={card_roja}
    required
  />
</div>

<div className="mb-3 mt-3">
  <label htmlFor="goles" className="form-label">
    Goles:
  </label>
  <input
    id="goles"
    placeholder="Ingrese la cantidad de goles"
    name="goles"
    type="number"
    min={0}
    className="form-control validate required light-blue-text"
    onChange={(e) => setgoles(e.target.value)}
    value={goles}
    required
  />
</div>

<div className="mb-3 mt-3">
  <label htmlFor="asistencias" className="form-label">
    Asistencias:
  </label>
  <input
    id="asistencias"
    placeholder="Ingrese la cantidad de asistencias"
    name="asistencias"
    type="number"
    min={0}
    className="form-control validate required light-blue-text"
    onChange={(e) => setasistencias(e.target.value)}
    value={asistencias}
    required
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


      <div className="table-responsive card my-2">   
  <table className="table ">
  <thead className="thead-light">
  <tr>
    <th className="text-center">Equipo</th>
    <th className="text-center">Nombre</th>
    <th className="text-center">Apellido</th>
    <th className="text-center">Edad</th>
    <th className="text-center">Número</th>
    <th className="text-center card-icon">
      Tarjeta 
      <span>
        <img className="card_red" src={card_red} alt="Tarjeta Roja" />
      </span>
    </th>
    <th className="text-center card-icon">
      Tarjeta 
      <span>
        <img className="card_red" src={card_yellow} alt="Tarjeta Amarilla" />
      </span>
    </th>
    <th className="text-center">Goles</th>
    <th className="text-center">Asistencias</th>
    <th className="text-center">Acciones</th>
  </tr>
</thead>
<tbody>
    {Jugadores.map((jugador) => (
            <tr key={jugador.id}>
                <td className="text-center">{jugador.equipo.nombre}</td>
                <td className="text-center">{jugador.nombre}</td>
                <td className="text-center">{jugador.apellido}</td>
                <td className="text-center">{jugador.edad}</td>
                <td className="text-center">{jugador.numero}</td>
                <td className="text-center">{jugador.card_amarilla} </td>
                <td className="text-center">{jugador.card_roja}</td>
                <td className="text-center">{jugador.goles } </td>
                <td className="text-center">{jugador.asistencias}</td>
              {/* <td className="center">{subcategoria.categoria.nombre}</td> */}
              <td className="text-center">
          
              <button className="btn btn-warning" onClick={() => handleEditClick(jugador)}>Editar</button>
          
              <button
                     className="btn btn-danger far fa-trash-alt delete-btn"
                     onClick={(e) => {
                       e.preventDefault();
                       deleteJugadores(jugador.id);
                     }}
                   >
                     Borrar
                   </button>               
            </td>
          </tr>   
            ))} 
         
    </tbody>
  </table>
  
  <ModalJugadores
      showModal={showModal}
      onClose={handleCloseModal}
      PlayerData={selectedJugador} // Pasa los datos del jugador al modal
      API_ENDPOINT={API_ENDPOINT} // Pasa el endpoint API
      onSave={saveJugador} // Función para guardar el jugador
    />
</div>
    </div>
  );
};

export default FORM_Players;
