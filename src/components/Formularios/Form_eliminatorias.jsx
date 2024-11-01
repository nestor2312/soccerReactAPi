import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import EliminatoriasInfo from "../Admin/EliminatoriasCuadro";

const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;
const endpoint = `${API_ENDPOINT}eliminatoria`;
const equiposEndpoint = `${API_ENDPOINT}equipos`;
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
  // eslint-disable-next-line no-unused-vars
  const [tipoEliminatoria, setTipoEliminatoria] = useState("solo_ida");

  
  const [equipoVisitanteID, setEquipoVisitante] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);
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
    const fetchEquipos = async () => {
      try {
        const response = await axios.get(equiposEndpoint);
        setEquipos(response.data);
      } catch (error) {
        console.error("Error al obtener los equipos:", error);
      }
    };

    fetchSubcategorias();
    fetchEquipos(); 
  }, []);

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
    const data = {
      ...marcadores,
      equipo_a_id: equipoLocalID,
      equipo_b_id: equipoVisitanteID,
      numPartido,
      tipo_eliminatoria: tipoEliminatoria,
    
      subcategoria_id: SubcategoriaID,
    };
    console.log('los datos a enviar son ===>',data);
    try {
      await axios.post(endpoint, data);
      alert("Datos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  };

  return (
    <><div>
      <h1 className="text-left">Registro de Eliminatorias</h1>
      <form className="col s12" onSubmit={store}>
        <div className="row">
          {/* subcategoria */}

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
          {/* Equipo Local */}
          <div className="input-field col s12 m6">
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
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {fieldsToShow.ida && (
          <>
            <label className="form-label mt-3">Marcador Local (Ida)</label>
            <input
              className="form-control validate"
              name="marcador1_ida"
              type="number"
              placeholder="Marcador Local (Ida)"
              value={marcadores.marcador1_ida}
              onChange={handleMarcadorChange}
            />
            <label className="form-label  mt-3">Marcador Visitante (Ida)</label>
            <input
              className="form-control validate"
              name="marcador2_ida"
              type="number"
              placeholder="Marcador Visitante (Ida)"
              value={marcadores.marcador2_ida}
              onChange={handleMarcadorChange}
            />
          </>
        )}

        {/* Campo Marcador Vuelta */}
        {fieldsToShow.vuelta && (
          <>
            <label className="form-label mt-3">Marcador Local (Vuelta)</label>
            <input
              className="form-control validate"
              name="marcador1_vuelta"
              type="number"
              placeholder="Marcador Local (Vuelta)"
              value={marcadores.marcador1_vuelta}
              onChange={handleMarcadorChange}
            />
            <label className="form-label mt-3">Marcador Visitante (Vuelta)</label>
            <input
              className="form-control validate"
              name="marcador2_vuelta"
              type="number"
              placeholder="Marcador Visitante (Vuelta)"
              value={marcadores.marcador2_vuelta}
              onChange={handleMarcadorChange}
            />
          </>
        )}

        {/* Campo Penales */}
        {fieldsToShow.penales && (
          <>
            <label className="form-label mt-3">Penales Local</label>
            <input
              className="form-control validate "
              name="marcador1_penales"
              type="number"
              placeholder="Penales Local"
              value={marcadores.marcador1_penales}
              onChange={handleMarcadorChange}
            />
            <label className="form-label mt-3">Penales Visitante</label>
            <input
              className="form-control validate"
              name="marcador2_penales"
              type="number"
              placeholder="Penales Visitante"
              value={marcadores.marcador2_penales}
              onChange={handleMarcadorChange}
            />
          </>
        )}

          {/* Equipo Visitante */}
          <div className="input-field col s12 m6">
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
              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Partido */}
          <div className="input-field col s12 m6">
            <label>Número de Partido</label>
            <input
              id="numPartido"
              name="numPartido"
              type="number"
              placeholder="Número de Partido"
              className="form-control validate light-blue-text"
              onChange={(e) => setNumPartido(e.target.value)}
              value={numPartido} />
          </div>

          {/* Tipo de Eliminatoria */}
          <div className="input-field col s12 m6">
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

         

          {/* Botón Enviar */}
          <div className="col s12 m12 mt-3">
            <button className="btn btn-outline-info" type="submit">
              Enviar
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
              {subcategoria.nombre}
            </option>
          ))}
        </select>


        

        <EliminatoriasInfo/>
        
        <ul className="nav nav-pills">
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
            {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"} 
            <span> VS </span>
            {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
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
            <a href={`{{ route('eliminatorias.reset', ${partido.id}) }}`} className="btn btn-info">
              <i className="fas fa-sync-alt"></i> Reiniciar
            </a>
            <a href={`eliminatorias/${partido.id}/edit`} className="btn btn-warning">
              <i className="fas fa-pen"></i> Editar
            </a>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>


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
            {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"} 
            <span> VS </span>
            {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
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
            <a href={`{{ route('eliminatorias.reset', ${partido.id}) }}`} className="btn btn-info">
              <i className="fas fa-sync-alt"></i> Reiniciar
            </a>
            <a href={`eliminatorias/${partido.id}/edit`} className="btn btn-warning">
              <i className="fas fa-pen"></i> Editar
            </a>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
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
            {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"} 
            <span> VS </span>
            {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
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
            <a href={`{{ route('eliminatorias.reset', ${partido.id}) }}`} className="btn btn-info">
              <i className="fas fa-sync-alt"></i> Reiniciar
            </a>
            <a href={`eliminatorias/${partido.id}/edit`} className="btn btn-warning">
              <i className="fas fa-pen"></i> Editar
            </a>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
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
            {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"}
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
            {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
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
    // Definir valores de ida y vuelta para global y penales
    const marcador1_ida = partido.marcador1_ida || '';
    const marcador1_vuelta = partido.marcador1_vuelta || '';
    const marcador2_ida = partido.marcador2_ida || '';
    const marcador2_vuelta = partido.marcador2_vuelta || '';

    // Calcular el marcador global solo si hay marcador de vuelta
    const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
    const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

    // Determinar el ganador en caso de ida/vuelta o en penales
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
              {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador1_ida} - {marcador1_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador1_vuelta && ` (Global: ${marcador1_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? ` | Penales: ${partido.marcador1_penales}` : ""}
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
              {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador2_ida} - {marcador2_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador2_vuelta && ` (Global: ${marcador2_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? ` | Penales: ${partido.marcador2_penales}` : ""}
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
    // Definir valores de ida y vuelta y global
    const marcador1_ida = partido.marcador1_ida || '';
    const marcador1_vuelta = partido.marcador1_vuelta || '';
    const marcador2_ida = partido.marcador2_ida || '';
    const marcador2_vuelta = partido.marcador2_vuelta || '';

    // Calcular el marcador global solo si hay marcador de vuelta
    const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
    const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

    // Determinar el ganador con marcador global y penales
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
              {partido.equipo_aa ? partido.equipo_aa.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador1_ida} {marcador1_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador1_vuelta && ` (${marcador1_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador1_penales !== undefined && partido.marcador1_penales !== null ? `(${partido.marcador1_penales})` : ""}
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
              {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
            </span>
            <span className="goles">
              {marcador2_ida} {marcador2_vuelta || "-"}
              {/* Mostrar global solo si hay marcador de vuelta */}
              {marcador2_vuelta && ` (${marcador2_global})`}
              {/* Mostrar penales solo si están definidos */}
              {partido.marcador2_penales !== undefined && partido.marcador2_penales !== null ? `(${partido.marcador2_penales})` : ""}
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
            <span className="equipo">Por definir ganador</span>
          </div>
        );
      })()
    ) : (
      <div className="jugador">
        <span className="equipo">Por definir ganador</span>
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