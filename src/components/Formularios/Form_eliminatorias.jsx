/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import EditPlayOffsModal from "../Formularios-edit/ModalEditPlayOffs";
import Swal from "sweetalert2";
import CreateIcon from '@mui/icons-material/Create';
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;
const endpoint = `${API_ENDPOINT}eliminatoria`;
const Images = IMAGES_URL;
const FORM_Eliminatorias = () => {

  const [marcadores, setMarcadores] = useState({
    marcador1_ida: '',
    marcador2_ida: '',
    marcador1_vuelta: '',
    marcador2_vuelta: '',
    marcador1_penales: '',
    marcador2_penales: '',
  });

  const [numPartido, setNumPartido] = useState("");
  const [tipoEliminatoria, setTipoEliminatoria] = useState("solo_ida");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [equipoVisitanteID, setEquipoVisitante] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });
  const [showModal, setShowModal] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const handleEditClick = (partido) => {
    setSelectedPartido(partido); // Asignar los datos del partido al estado
    setShowModal(true); // Mostrar el modal
  };

  
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPartido(null); // Limpiar los datos del partido
  };
  

  const partidosEsperadosCuartos = 4;
  const partidosEsperadosSemis = 2;
  const partidosEsperadosFinal = 1;
  let partidosCuartos = [...eliminatoriasCuartos];
  let partidosSemis = [...eliminatoriasSemis];
  let partidoFinal = [...eliminatoriasFinal];
  while (partidosCuartos.length < partidosEsperadosCuartos) {
    partidosCuartos.push({ 
    });
  }
  while (partidosSemis.length < partidosEsperadosSemis) {
    partidosSemis.push({ 
    });
  }
  while (partidoFinal.length < partidosEsperadosFinal) {
    partidoFinal.push({
    });
  }
  const handleSubcategoriaChange = (e) => {
    setSelectedSubcategoria(e.target.value);
  };

  useEffect(() => {
    const getEliminatorias = async () => {
      if (selectedSubcategoria) {
        try {
          const response = await axios.get(`${API_ENDPOINT}eliminatoria/subcategoria/${selectedSubcategoria}`);   
          const eliminatoriasData = response.data; // Almacenar la respuesta en una variable
          setEliminatoriasCuartos(eliminatoriasData.cuartos || []);
          setEliminatoriasSemis(eliminatoriasData.semis || []);
          setEliminatoriasFinal(eliminatoriasData.final || []);
          console.log("Datos de eliminatorias:", eliminatoriasData);
        } catch (error) {
          console.error("Error al obtener los partidos:", error);
          // Mostrar un mensaje de error al usuario
          // eslint-disable-next-line no-undef
          setError('Ocurrió un error al cargar los datos');
        }
      }
    };
    getEliminatorias();
  }, [selectedSubcategoria]);
    
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


  const [selectedPartido, setSelectedPartido] = useState(null);

  
  const [fieldsToShow, setFieldsToShow] = useState({
    ida: false,
    vuelta: false,
    penales: false,
});

useEffect(() => {
  setFieldsToShow({
      ida: tipoEliminatoria === 'ida_vuelta' || tipoEliminatoria === 'solo_ida',
      vuelta: tipoEliminatoria === 'ida_vuelta',
      penales: tipoEliminatoria === 'penales',
  });
}, [tipoEliminatoria]);

const handleMarcadorChange = (e) => {
  const { name, value } = e.target;
  setMarcadores(prevMarcadores => ({
      ...prevMarcadores,
      [name]: value,
  }));
};


const store = async (e) => {
  e.preventDefault();

  // Convertir numPartido a número y verificar que sea válido
  const partidoNumero = parseInt(numPartido, 10);
  if (isNaN(partidoNumero)) {
    alert("El número de partido es inválido");
    return;
  }

  // Definir los límites por fase (clave: numPartido)
  const limitesRondas = {
    1: 4, // Cuartos de final
    2: 2, // Semifinales
    3: 1, // Final
  };

  const maxRegistros = limitesRondas[partidoNumero];
  if (!maxRegistros) {
    alert("El número de partido no corresponde a ninguna etapa válida.");
    return;
  }

  // Seleccionar la lista correspondiente de eliminatorias según la fase
  let registrosActuales = [];
  switch (partidoNumero) {
    case 1:
      registrosActuales = eliminatoriasCuartos;
      break;
    case 2:
      registrosActuales = eliminatoriasSemis;
      break;
    case 3:
      registrosActuales = eliminatoriasFinal;
      break;
    default:
      alert("El partido no corresponde a una fase válida.");
      return;
  }

  // Filtrar registros actuales según subcategoria_id y numPartido
  const registrosFiltrados = registrosActuales.filter(
    (registro) =>
      parseInt(registro.numPartido, 10) === partidoNumero &&
      parseInt(registro.subcategoria_id, 10) === parseInt(SubcategoriaID, 10)
  );

  // Validar el límite de registros antes de proceder
  if (registrosFiltrados.length >= maxRegistros) {
    Swal.fire({
      title: "Advertencia",
      text: `No puedes registrar más de ${maxRegistros} partidos para esta ronda en la subcategoría seleccionada.`,
      icon: "warning",
      confirmButtonText: "OK",
    
    })
    return;
  }

  // Preparar los datos para el backend
  const data = {
    ...marcadores,
    equipo_a_id: equipoLocalID,
    equipo_b_id: equipoVisitanteID,
    numPartido: partidoNumero,
    tipo_eliminatoria: tipoEliminatoria,
    subcategoria_id: parseInt(SubcategoriaID, 10),
  };

  console.log("Datos enviados al backend:", data);

  try {
    // Enviar datos al backend
    const response = await axios.post(endpoint, data);
    console.log("Respuesta del servidor:", response.data);

    // Recargar las eliminatorias desde el backend
    const getResponse = await axios.get(`${API_ENDPOINT}eliminatoria/subcategoria/${SubcategoriaID}`);
    const updatedEliminatorias = getResponse.data;

    // Actualizar estados locales
    setEliminatoriasCuartos(updatedEliminatorias.cuartos || []);
    setEliminatoriasSemis(updatedEliminatorias.semis || []);
    setEliminatoriasFinal(updatedEliminatorias.final || []);

    setAlerta({ mensaje: "¡Partido registrado correctamente!", tipo: "success" });
    setMarcadores("");
    setEquipoVisitante("");
    setEquipoLocal("");
   
    setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    setAlerta({ mensaje: "¡Error al registrar el partido!", tipo: "danger" });
    setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
  
  }
};

const abreviarNombre = (nombre) => {
  if (!nombre) return "Por Definir";

  // Dividir el nombre en palabras
  const palabras = nombre.split(" ");

  if (palabras.length >= 2) {
    // Primera letra de la primera palabra
    const primeraLetraPrimeraPalabra = palabras[0].charAt(0).toUpperCase();
    // Primera letra de la segunda palabra
    const primeraLetraSegundaPalabra = palabras[1].charAt(0).toUpperCase();
    // Segunda letra de la segunda palabra (si fuera necesario)
    const adicional = palabras[1].charAt(1).toUpperCase() || palabras[0].charAt(1).toUpperCase();

    return (
      primeraLetraPrimeraPalabra + 
      primeraLetraSegundaPalabra + 
      adicional
    ).slice(0, 3); // Asegurar 3 caracteres
  }

  // Si solo hay una palabra, tomar los primeros 3 caracteres
  return nombre.slice(0, 3).toUpperCase();
};







const saveEliminatoria = async (updatedEliminatoria) => {
  console.log('datos enviados al back son : ', updatedEliminatoria);
  try {
    await axios.put(`${API_ENDPOINT}eliminatoria/${updatedEliminatoria.id}`, updatedEliminatoria);
    setAlerta({ mensaje: "¡Partido actualizado correctamente!", tipo: "success" });
    setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    const response = await axios.get(`${API_ENDPOINT}eliminatoria/subcategoria/${selectedSubcategoria}`);
    const updatedEliminatoriasData = response.data;

    // Actualiza el estado con los datos obtenidos de la nueva solicitud
    setEliminatoriasCuartos(updatedEliminatoriasData.cuartos || []);
    setEliminatoriasSemis(updatedEliminatoriasData.semis || []);
    setEliminatoriasFinal(updatedEliminatoriasData.final || []);
  } catch (error) {
    console.error("Error al actualizar eliminatoria:", error);
    setAlerta({ mensaje: "¡Error al actualizar el partido!", tipo: "danger" });
    setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
  }
};

  


  useEffect(() => {
    document.title = "Admin - Eliminatorias";
  }, []);
  return (
    <><div>
       {alerta.mensaje && (
        <div
          className={`alert alert-${alerta.tipo} alert-dismissible fade show`}
          role="alert"
        >
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

      <h1 className="text-left">Registro de Eliminatorias</h1>
      <form className="mt-2 mb-4" onSubmit={store}>
  <div className="row">
    {/* Subcategoría */}
    <div className="col-12 mb-3">
      <label htmlFor="subcategoria_id">Selecciona una Subcategoría:</label>
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
          <option key={subcategoria.id} value={subcategoria.id} className="text-capitalize">
            {subcategoria.nombre} -  {subcategoria.categoria?.torneo?.nombre}
          </option>
        ))}
      </select>
    </div>

    {/* Equipo Local */}
    <div className="col-12 col-md-6 mb-3">
      <label htmlFor="equipo_local" className="form-label">
        Selecciona Equipo Local
      </label>
      <select
        id="equipo_local"
        name="equipo_local"
        className="form-control validate"
        onChange={(e) => setEquipoLocal(e.target.value)}
        value={equipoLocalID}
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

    {/* Equipo Visitante */}
    <div className="col-12 col-md-6 mb-3">
      <label htmlFor="equipo_visitante" className="form-label">
        Selecciona Equipo Visitante
      </label>
      <select
        id="equipo_visitante"
        name="equipo_visitante"
        className="form-control validate"
        onChange={(e) => setEquipoVisitante(e.target.value)}
        value={equipoVisitanteID}
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

    {/* Número de Partido */}
    {/* <div className="col-12 col-md-6 mb-3">
      <label htmlFor="numPartido">Número de Partido</label>
      <input
        id="numPartido"
        name="numPartido"
        type="number"
        min={1}
        max={3}
        placeholder="Número de Partido"
        className="form-control validate light-blue-text"
        onChange={(e) => setNumPartido(e.target.value)}
        value={numPartido}
      />
    </div> */}
     <div className="col-12 col-md-6 mb-3">
  <label htmlFor="numPartido">Ronda</label>
  <select
    id="numPartido"
    name="numPartido"
    className="form-control validate"
    onChange={(e) => setNumPartido(e.target.value)}
    value={numPartido}
  >
    <option value="" disabled>
      Selecciona ronda
    </option>
    <option value="1">Cuartos</option>
    <option value="2">Semifinal</option>
    <option value="3">Final</option>
  </select>
</div>


    {/* Tipo de Eliminatoria */}
    <div className="col-12 col-md-6 mb-3">
      <label htmlFor="tipo_eliminatoria" className="form-label">
        Tipo de Eliminatoria
      </label>
      <select
        id="tipo_eliminatoria"
        name="tipo_eliminatoria"
        className="form-control validate"
        onChange={(e) => setTipoEliminatoria(e.target.value)}
        value={tipoEliminatoria}
      >
        <option value="solo_ida">Solo Ida</option>
        <option value="ida_vuelta">Ida y Vuelta</option>
        <option value="penales">Penales</option>
      </select>
    </div>
  </div>

  {/* Sección de Marcadores */}
  <div className="row">
    {/* Si se muestran campos para ida */}
    {fieldsToShow.ida && (
      <>
        <div className="col-12 mb-3">
          <label className="form-label">Marcador Local (Ida)</label>
          <input
            className="form-control validate"
            name="marcador1_ida"
            type="number"
            min={0}
            max={100}
            placeholder="Marcador Local (Ida)"
            value={marcadores.marcador1_ida}
            onChange={handleMarcadorChange}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Marcador Visitante (Ida)</label>
          <input
            className="form-control validate"
            name="marcador2_ida"
            type="number"
            min={0}
            max={100}
            placeholder="Marcador Visitante (Ida)"
            value={marcadores.marcador2_ida}
            onChange={handleMarcadorChange}
          />
        </div>
      </>
    )}

    {/* Si se muestran campos para vuelta */}
    {fieldsToShow.vuelta && (
      <>
        <div className="col-12 mb-3">
          <label className="form-label">Marcador Local (Vuelta)</label>
          <input
            className="form-control validate"
            name="marcador1_vuelta"
            type="number"
            min={0}
            max={20}
            placeholder="Marcador Local (Vuelta)"
            value={marcadores.marcador1_vuelta}
            onChange={handleMarcadorChange}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Marcador Visitante (Vuelta)</label>
          <input
            className="form-control validate"
            name="marcador2_vuelta"
            type="number"
            min={0}
            max={100}
            placeholder="Marcador Visitante (Vuelta)"
            value={marcadores.marcador2_vuelta}
            onChange={handleMarcadorChange}
          />
        </div>
      </>
    )}

    {/* Si se muestran campos para penales */}
    {fieldsToShow.penales && (
      <>
        <div className="col-12 mb-3">
          <label className="form-label">Penales Local</label>
          <input
            className="form-control validate"
            name="marcador1_penales"
            type="number"
            min={0}
            max={20}
            placeholder="Penales Local"
            value={marcadores.marcador1_penales}
            onChange={handleMarcadorChange}
          />
        </div>
        <div className="col-12 mb-3">
          <label className="form-label">Penales Visitante</label>
          <input
            className="form-control validate"
            name="marcador2_penales"
            type="number"
            min={0}
            max={100}
            placeholder="Penales Visitante"
            value={marcadores.marcador2_penales}
            onChange={handleMarcadorChange}
          />
        </div>
      </>
    )}
  </div>

  

  {/* Botón Enviar */}
  <div className="row">
    <div className="col-12 mt-3">
      <button className="btn btn-outline-primary " type="submit">
        Registrar Partido
      </button>
    </div>
  </div>
</form>

    </div>
    <div>


        <h3 className="mt-4">Informacion de eliminatorias</h3>

      

        <select id="subcategoria"    className="form-control" onChange={handleSubcategoriaChange}>
          <option value="">Seleccione una subcategoría</option>
          {subcategorias.map((subcategoria) => (
            <option key={subcategoria.id} value={subcategoria.id}>
              {subcategoria.nombre} - {subcategoria.categoria?.torneo?.nombre}
            </option>
          ))}
        </select>

  
        <ul className="nav nav-pills mt-4 mb-3">
          <li className="nav-item">
            <a className="nav-link active" data-bs-toggle="tab" href="#home">
              Cuartos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#menu1">
              Semis
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-bs-toggle="tab" href="#menu2">
              Final
            </a>
          </li>
        </ul>

        <div className="tab-content">
        <div className="tab-pane container active" id="home">
        <table className="table">
  <thead>
    <tr>
      <th className="text-center fondo-card-admin">Cuartos de final</th>
      
      {/* Mostrar el encabezado de "Ida" solo si algún partido tiene marcadorIda (incluyendo 0) */}
      {partidosCuartos.some(partido => partido.marcador1_ida !== undefined && partido.marcador1_ida !== null) && (
        <th className="text-center fondo-card-admin">Ida</th>
      )}
      
      {/* Mostrar el encabezado de "Vuelta" solo si algún partido tiene marcadorVuelta (incluyendo 0) */}
      {partidosCuartos.some(partido => partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null) && (
        <th className="text-center fondo-card-admin">Vuelta</th>
      )}

      {/* Mostrar el encabezado de "Global" solo si algún partido tiene marcadorVuelta (incluyendo 0) */}
      {partidosCuartos.some(partido => partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null) && (
        <th className="text-center fondo-card-admin">Global</th>
      )}
      
      {/* Mostrar el encabezado de "Penales" solo si algún partido tiene marcadorPenales (incluyendo 0) */}
      {partidosCuartos.some(partido => partido.marcador1_penales !== undefined && partido.marcador1_penales !== null) && (
        <th className="text-center fondo-card-admin">Penales</th>
      )}
      
      <th className="text-center fondo-card-admin">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {partidosCuartos.map((partido, index) => {
      // Calcular marcador global solo si hay marcador de vuelta
      const marcador1_global = (partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null)
        ? partido.marcador1_ida + partido.marcador1_vuelta
        : null;
      const marcador2_global = (partido.marcador2_vuelta !== undefined && partido.marcador2_vuelta !== null)
        ? partido.marcador2_ida + partido.marcador2_vuelta
        : null;

      return (
        <tr key={index} className="fondo-card-admin">
          <td className="text-center">
            {partido.equipo_aa ? partido.equipo_aa.nombre : "Por Definir"} 
            <strong> VS </strong>
            {partido.equipo_b ? partido.equipo_b.nombre : "Por Definir"}
          </td>
          
          {/* Mostrar marcador de Ida solo si existe */}
          {partidosCuartos.some(p => p.marcador1_ida !== undefined && p.marcador1_ida !== null) && (
            <td className="text-center">
              {partido.marcador1_ida ?? ""} - {partido.marcador2_ida ?? ""}
            </td>
          )}
          
          {/* Mostrar marcador de Vuelta solo si existe */}
          {partidosCuartos.some(p => p.marcador1_vuelta !== undefined && p.marcador1_vuelta !== null) && (
            <td className="text-center">
              {partido.marcador1_vuelta ?? ""} - {partido.marcador2_vuelta ?? ""}
            </td>
          )}
          
          {/* Mostrar marcador Global solo si marcador de vuelta existe */}
          {partidosCuartos.some(p => p.marcador1_vuelta !== undefined && p.marcador1_vuelta !== null) && (
            <td className="text-center">
              {marcador1_global !== null ? marcador1_global : ""} - {marcador2_global !== null ? marcador2_global : ""}
            </td>
          )}
          
          {/* Mostrar marcador de Penales solo si existe */}
          {partidosCuartos.some(p => p.marcador1_penales !== undefined && p.marcador1_penales !== null) && (
            <td className="text-center">
              {partido.marcador1_penales ?? ""} - {partido.marcador2_penales ?? ""}
            </td>
          )}
          
          <td className="text-center">
            <button className="btn btn-warning" onClick={() => handleEditClick(partido)}>  <CreateIcon/></button>

          </td>
        </tr>
      );
    })}
  </tbody>
</table>


 <EditPlayOffsModal
      showModal={showModal}
      onClose={handleCloseModal}
      PlayOffsData={selectedPartido} // Pasa los datos del partido al modal
      API_ENDPOINT={API_ENDPOINT} // Pasa el endpoint API
      onSave={saveEliminatoria} // Función para guardar el partido
    />
</div>


          <div className="tab-pane container fade" id="menu1">
          <table className="table">
  <thead>
    <tr>
      <th className="text-center fondo-card-admin">Semifinal</th>
      
      {/* Mostrar el encabezado de "Ida" solo si algún partido tiene marcadorIda (incluyendo 0) */}
      {partidosSemis.some(partido => partido.marcador1_ida !== undefined && partido.marcador1_ida !== null) && (
        <th className="text-center fondo-card-admin">Ida</th>
      )}
      
      {/* Mostrar el encabezado de "Vuelta" solo si algún partido tiene marcadorVuelta (incluyendo 0) */}
      {partidosSemis.some(partido => partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null) && (
        <th className="text-center fondo-card-admin">Vuelta</th>
      )}

      {/* Mostrar el encabezado de "Global" solo si algún partido tiene marcadorVuelta (incluyendo 0) */}
      {partidosSemis.some(partido => partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null) && (
        <th className="text-center fondo-card-admin">Global</th>
      )}
      
      {/* Mostrar el encabezado de "Penales" solo si algún partido tiene marcadorPenales (incluyendo 0) */}
      {partidosSemis.some(partido => partido.marcador1_penales !== undefined && partido.marcador1_penales !== null) && (
        <th className="text-center fondo-card-admin">Penales</th>
      )}
      
      <th className="text-center fondo-card-admin">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {partidosSemis.map((partido, index) => {
      // Calcular marcador global solo si hay marcador de vuelta
      const marcador1_global = (partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null)
        ? partido.marcador1_ida + partido.marcador1_vuelta
        : null;
      const marcador2_global = (partido.marcador2_vuelta !== undefined && partido.marcador2_vuelta !== null)
        ? partido.marcador2_ida + partido.marcador2_vuelta
        : null;

      return (
        <tr key={index} className="fondo-card-admin">
          <td className="text-center">
            {partido.equipo_aa ? partido.equipo_aa.nombre : "Por Definir"} 
            <strong> VS </strong>
            {partido.equipo_b ? partido.equipo_b.nombre : "Por Definir"}
          </td>
          
          {/* Mostrar marcador de Ida solo si existe */}
          {partidosSemis.some(p => p.marcador1_ida !== undefined && p.marcador1_ida !== null) && (
            <td className="text-center">
              {partido.marcador1_ida ?? ""} - {partido.marcador2_ida ?? ""}
            </td>
          )}
          
          {/* Mostrar marcador de Vuelta solo si existe */}
          {partidosSemis.some(p => p.marcador1_vuelta !== undefined && p.marcador1_vuelta !== null) && (
            <td className="text-center">
              {partido.marcador1_vuelta ?? ""} - {partido.marcador2_vuelta ?? ""}
            </td>
          )}
          
          {/* Mostrar marcador Global solo si marcador de vuelta existe */}
          {partidosSemis.some(p => p.marcador1_vuelta !== undefined && p.marcador1_vuelta !== null) && (
            <td className="text-center">
              {marcador1_global !== null ? marcador1_global : ""} - {marcador2_global !== null ? marcador2_global : ""}
            </td>
          )}
          
          {/* Mostrar marcador de Penales solo si existe */}
          {partidosSemis.some(p => p.marcador1_penales !== undefined && p.marcador1_penales !== null) && (
            <td className="text-center">
              {partido.marcador1_penales ?? ""} - {partido.marcador2_penales ?? ""}
            </td>
          )}
          
          <td className="text-center">
            <button className="btn btn-warning" onClick={() => handleEditClick(partido)}>  <CreateIcon/></button>

          </td>
        </tr>
      );
    })}
  </tbody>
</table>
<EditPlayOffsModal
      showModal={showModal}
      onClose={handleCloseModal}
      PlayOffsData={selectedPartido} // Pasa los datos del partido al modal
      API_ENDPOINT={API_ENDPOINT} // Pasa el endpoint API
      onSave={saveEliminatoria} // Función para guardar el partido
    />
          </div>
          
          <div className="tab-pane container fade" id="menu2">
          <table className="table">
  <thead>
    <tr>
      <th className="text-center fondo-card-admin">Final</th>
      
      {/* Mostrar el encabezado de "Ida" solo si algún partido tiene marcadorIda (incluyendo 0) */}
      {partidoFinal.some(partido => partido.marcador1_ida !== undefined && partido.marcador1_ida !== null) && (
        <th className="text-center fondo-card-admin">Ida</th>
      )}
      
      {/* Mostrar el encabezado de "Vuelta" solo si algún partido tiene marcadorVuelta (incluyendo 0) */}
      {partidoFinal.some(partido => partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null) && (
        <th className="text-center fondo-card-admin">Vuelta</th>
      )}

      {/* Mostrar el encabezado de "Global" solo si algún partido tiene marcadorVuelta (incluyendo 0) */}
      {partidoFinal.some(partido => partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null) && (
        <th className="text-center fondo-card-admin">Global</th>
      )}
      
      {/* Mostrar el encabezado de "Penales" solo si algún partido tiene marcadorPenales (incluyendo 0) */}
      {partidoFinal.some(partido => partido.marcador1_penales !== undefined && partido.marcador1_penales !== null) && (
        <th className="text-center fondo-card-admin">Penales</th>
      )}
      
      <th className="text-center fondo-card-admin">Acciones</th>
    </tr>
  </thead>
  <tbody>
    {partidoFinal.map((partido, index) => {
      // Calcular marcador global solo si hay marcador de vuelta
      const marcador1_global = (partido.marcador1_vuelta !== undefined && partido.marcador1_vuelta !== null)
        ? partido.marcador1_ida + partido.marcador1_vuelta
        : null;
      const marcador2_global = (partido.marcador2_vuelta !== undefined && partido.marcador2_vuelta !== null)
        ? partido.marcador2_ida + partido.marcador2_vuelta
        : null;

      return (
        <tr key={index} className="fondo-card-admin">
          <td className="text-center">
            {partido.equipo_aa ? partido.equipo_aa.nombre : "Por Definir"} 
            <strong> VS </strong>
            {partido.equipo_b ? partido.equipo_b.nombre : "Por Definir"}
          </td>
          
          {/* Mostrar marcador de Ida solo si existe */}
          {partidoFinal.some(p => p.marcador1_ida !== undefined && p.marcador1_ida !== null) && (
            <td className="text-center">
              {partido.marcador1_ida ?? ""} - {partido.marcador2_ida ?? ""}
            </td>
          )}
          
          {/* Mostrar marcador de Vuelta solo si existe */}
          {partidoFinal.some(p => p.marcador1_vuelta !== undefined && p.marcador1_vuelta !== null) && (
            <td className="text-center">
              {partido.marcador1_vuelta ?? ""} - {partido.marcador2_vuelta ?? ""}
            </td>
          )}
          
          {/* Mostrar marcador Global solo si marcador de vuelta existe */}
          {partidoFinal.some(p => p.marcador1_vuelta !== undefined && p.marcador1_vuelta !== null) && (
            <td className="text-center">
              {marcador1_global !== null ? marcador1_global : ""} - {marcador2_global !== null ? marcador2_global : ""}
            </td>
          )}
          
          {/* Mostrar marcador de Penales solo si existe */}
          {partidoFinal.some(p => p.marcador1_penales !== undefined && p.marcador1_penales !== null) && (
            <td className="text-center">
              {partido.marcador1_penales ?? ""} - {partido.marcador2_penales ?? ""}
            </td>
          )}
          
          <td className="text-center">
            <button className="btn btn-warning" onClick={() => handleEditClick(partido)}>  <CreateIcon/></button>

          </td>
        </tr>
      );
    })}
  </tbody>
</table>
<EditPlayOffsModal
      showModal={showModal}
      onClose={handleCloseModal}
      PlayOffsData={selectedPartido} // Pasa los datos del partido al modal
      API_ENDPOINT={API_ENDPOINT} // Pasa el endpoint API
      onSave={saveEliminatoria} // Función para guardar el partido
    />
          </div>
        </div>

        {/* Esquema de eliminatorias */}

        <div className="col-sm-12 col-md-12 mt-4">
          <div className="card mt-2 border-0 shadow">
            <div className="card-header fondo-card-admin TITULO-admin border-0">
              Eliminatorias
            </div>
            <div className="titulos">
              <div className="titulo">Cuartos</div>
              <div className="titulo">Semis</div>
              <div className="titulo">Final</div>
              <div className="titulo">Campeón</div>
            </div>
            <div>
              <div className="esquema">
                <div className="jornada_contenedor">
                {/* Cuartos */}
                {partidosCuartos.map((partido, index) => {
  const marcador1_ida = partido.marcador1_ida;
  const marcador1_vuelta = partido.marcador1_vuelta;
  const marcador2_ida = partido.marcador2_ida;
  const marcador2_vuelta = partido.marcador2_vuelta;

  // Calcular los marcadores globales si hay marcador de vuelta
  const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
  const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

  // Condiciones para determinar el ganador
  const isLocalWinner = marcador1_global > marcador2_global || 
                        (marcador1_global === marcador2_global && partido.marcador1_penales > partido.marcador2_penales);
  const isVisitanteWinner = marcador2_global > marcador1_global || 
                            (marcador2_global === marcador1_global && partido.marcador2_penales > partido.marcador1_penales);

  return (
    <div className="partido" key={index}>
      <div className="jornada">
        {/* Equipo Local */}
        <div
          className={`jugador ${isLocalWinner ? "win" : isVisitanteWinner ? "lose" : ""}`}
        >
          <img
            src={`${Images}/${partido.equipo_aa?.archivo}`}
            alt=""
            className="logo" 
          />
          <span className="equipo">
          {partido.equipo_aa ? abreviarNombre(partido.equipo_aa.nombre) : "Por Definir"}

          
          </span>
          <span className="goles">
            {marcador1_ida} {marcador1_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador1_vuelta && ` (${marcador1_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `  (${partido.marcador1_penales})` : ""}
          </span>
        </div>

        {/* Equipo Visitante */}
        <div
          className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
        >
          <img
            src={`${Images}/${partido.equipo_b?.archivo}`}
            alt=""
            className="logo" 
          />
          <span className="equipo">
          {partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre) : "Por Definir"}

          </span>
          <span className="goles">
            {marcador2_ida} {marcador2_vuelta || ""}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador2_vuelta && ` (${marcador2_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `(${partido.marcador2_penales})` : ""}
          </span>
        </div>
      </div>
    </div>
  );
})}


                </div>

                {/* {{-- Conectores de octavos a cuartos --}} */}
                <div className="conectores">
                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble"></div>
                    <div className="conector_simple"></div>
                  </div>
                </div>

                {/* {{--semis --}} */}
                <div className="jornada_contenedor">
  {partidosSemis.map((partido, index) => {


const marcador1_ida = partido.marcador1_ida;
const marcador1_vuelta = partido.marcador1_vuelta;
const marcador2_ida = partido.marcador2_ida;
const marcador2_vuelta = partido.marcador2_vuelta;

// Calcular los marcadores globales si hay marcador de vuelta
const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

// Condiciones para determinar el ganador
const isLocalWinner = marcador1_global > marcador2_global || 
                      (marcador1_global === marcador2_global && partido.marcador1_penales > partido.marcador2_penales);
const isVisitanteWinner = marcador2_global > marcador1_global || 
                          (marcador2_global === marcador1_global && partido.marcador2_penales > partido.marcador1_penales);

    return (
      <>
        <div className="jornada" key={`local-${index}`}>
          <div
            className={`jugador ${isLocalWinner ? "win" : isVisitanteWinner ? "lose" : ""}`}
          >
            <img
              src={`${Images}/${partido.equipo_aa?.archivo}`}
              alt=""
              className="logo" 
            />
            <span className="equipo">
            {partido.equipo_aa ? abreviarNombre(partido.equipo_aa.nombre) : "Por Definir"}
            </span>
            <span className="goles">
            {marcador1_ida} {marcador1_vuelta || ""}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador1_vuelta && ` (${marcador1_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `  (${partido.marcador1_penales})` : ""}
            </span>
          </div>
        </div>
        
        <div className="jornada" key={`visitante-${index}`}>
          <div
            className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
          >
            <img
              src={`${Images}/${partido.equipo_b?.archivo}`}
              alt=""
              className="logo" 
            />
            <span className="equipo">
            {partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre) : "Por Definir"}
            </span>
            <span className="goles">
            {marcador2_ida} {marcador2_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador2_vuelta && ` (${marcador2_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `  (${partido.marcador2_penales})` : ""}
            </span>
          </div>
        </div>
      </>
    );
  })}
</div>


                {/* {{-- Conectores de cuartos a semifinal --}} */}
                <div className="conectores">
                  <div className="conector">
                    <div className="conector_doble conector_doble_semifinal"></div>
                    <div className="conector_simple"></div>
                  </div>

                  <div className="conector">
                    <div className="conector_doble conector_doble_semifinal"></div>
                    <div className="conector_simple"></div>
                  </div>
                </div>
                {/* {{-- final --}}     */}
                <div className="jornada_contenedor">
  {partidoFinal.map((partido, index) => {
     const marcador1_ida = partido.marcador1_ida;
     const marcador1_vuelta = partido.marcador1_vuelta;
     const marcador2_ida = partido.marcador2_ida;
     const marcador2_vuelta = partido.marcador2_vuelta;
   
     // Calcular los marcadores globales si hay marcador de vuelta
     const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
     const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;
   
     // Condiciones para determinar el ganador
     const isLocalWinner = marcador1_global > marcador2_global || 
                           (marcador1_global === marcador2_global && partido.marcador1_penales > partido.marcador2_penales);
     const isVisitanteWinner = marcador2_global > marcador1_global || 
                               (marcador2_global === marcador1_global && partido.marcador2_penales > partido.marcador1_penales);
   
    return (
      <>
        <div className="jornada" key={`local-${index}`}>
          <div className="conector_doble"></div>
          <div className="conector_simple"></div>
          <div
            className={`jugador ${isLocalWinner ? "win" : isVisitanteWinner ? "lose" : ""}`}
          >
            <img
              src={`${Images}/${partido.equipo_aa?.archivo}`}
              alt=""
              className="logo"
            />
            <span className="equipo">
            {partido.equipo_aa ? abreviarNombre(partido.equipo_aa.nombre) : "Por Definir"}
            </span>
            <span className="goles">
            {marcador1_ida} {marcador1_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador1_vuelta && ` (${marcador1_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `  (${partido.marcador1_penales})` : ""}
            </span>
          </div>
        </div>

        <div className="jornada" key={`visitante-${index}`}>
          <div className="conector_doble"></div>
          <div className="conector_simple"></div>
          <div
            className={`jugador ${isVisitanteWinner ? "win" : isLocalWinner ? "lose" : ""}`}
          >
            <img
              src={`${Images}/${partido.equipo_b?.archivo}`}
              alt=""
              className="logo"
            />
            <span className="equipo">
            {partido.equipo_b ? abreviarNombre(partido.equipo_b.nombre) : "Por Definir"}
            </span>
            <span className="goles">
            {marcador2_ida} {marcador2_vuelta || " "}
            {/* Goles Globales solo si hay marcador de vuelta */}
            {marcador2_vuelta && ` (${marcador2_global})`}
            {/* Penales solo si están definidos */}
            {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `  (${partido.marcador2_penales})` : ""}
            </span>
          </div>
        </div>
      </>
    );
  })}
</div>


                {/* {{-- Conectores de semifinal a ganador --}} */}
                <div className="conectores">
                  <div className="conector">
                    <div className="conector_doble conector_doble_ganador"></div>
                    <div className="conector_simple"></div>
                  </div>
                </div>

                {/* Ganador */}
                <div className="ganador_esquema">
  <div className="ganador">
    <div className="conector_doble"></div>
    <div className="conector_simple"></div>

    {/* Verificar si ambos marcadores de ida y vuelta están presentes */}
    {partidoFinal[0] && partidoFinal[0].marcador1_ida !== null && partidoFinal[0].marcador2_ida !== null ? (
      (() => {
        // Calcular el marcador global solo si hay marcador de vuelta
        const marcador1_global = partidoFinal[0].marcador1_vuelta !== null
          ? partidoFinal[0].marcador1_ida + partidoFinal[0].marcador1_vuelta
          : partidoFinal[0].marcador1_ida;
        const marcador2_global = partidoFinal[0].marcador2_vuelta !== null
          ? partidoFinal[0].marcador2_ida + partidoFinal[0].marcador2_vuelta
          : partidoFinal[0].marcador2_ida;

        // Determinar el equipo ganador considerando marcador global y penales
        const isLocalWinner = marcador1_global > marcador2_global ||
                              (marcador1_global === marcador2_global && partidoFinal[0].marcador1_penales > partidoFinal[0].marcador2_penales);
        const isVisitanteWinner = marcador2_global > marcador1_global ||
                                  (marcador2_global === marcador1_global && partidoFinal[0].marcador2_penales > partidoFinal[0].marcador1_penales);

        // Asignar el equipo ganador
        const equipoGanador = isLocalWinner ? partidoFinal[0].equipo_aa : isVisitanteWinner ? partidoFinal[0].equipo_b : null;

        return equipoGanador ? (
          <div className="jugador win">
            <img
              src={`${Images}/${equipoGanador.archivo}`}
              className="logo"
              alt={equipoGanador.nombre}
            />
            <span className="equipo">{equipoGanador.nombre}</span>
          </div>
        ) : (
          <div className="jugador">
            <span className="equipo">Por Definir ganador</span>
          </div>
        );
      })()
    ) : (
      <div className="jugador">
        <span className="equipo">Por Definir ganador</span>
      </div>
    )}
  </div>
</div>

              </div>
            </div>
          </div>
        </div>
      </div></>
    
  );
};

export default FORM_Eliminatorias;
