
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import Eliminatorias from "../Admin/FilElim"

const endpoint = `${API_ENDPOINT}eliminatoria`;
const equiposEndpoint = `${API_ENDPOINT}equipos`;
const InfoEliminatorias = `${API_ENDPOINT}eliminatorias`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;
const Images = IMAGES_URL;

const FORM_Eliminatorias = () => {
  const [marcador1, setMarcador1] = useState("");
  const [numPartido, setNumPartido] = useState("");
  const [marcador2, setMarcador2] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");
  const [equipoVisitanteID, setEquipoVisitante] = useState("");
  const [tipoEliminatoria, setTipoEliminatoria] = useState("solo_ida");
  const [tipoPartido, setTipoPartido] = useState("");

  const [equipos, setEquipos] = useState([]);

  

  const [SubcategoriaID, setSubcategoriaID] = useState("");

  const [Subcategorias, setSubcategoria] = useState([]);

  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);

  const partidosEsperadosCuartos = 4;
  const partidosEsperadosSemis = 2;
  const partidosEsperadosFinal = 1;

  let partidosCuartos = [...eliminatoriasCuartos];
  let partidosSemis = [...eliminatoriasSemis];
  let partidoFinal = [...eliminatoriasFinal];

  // Si hay menos de los partidos esperados, añadir partidos vacíos
  while (partidosCuartos.length < partidosEsperadosCuartos) {
    partidosCuartos.push({
      equipo_a: null,
      equipo_b: null,
      marcador1: null,
      marcador2: null,
    });
  }
  while (partidosSemis.length < partidosEsperadosSemis) {
    partidosSemis.push({
      equipo_a: null,
      equipo_b: null,
      marcador1: null,
      marcador2: null,
    });
  }
  while (partidoFinal.length < partidosEsperadosFinal) {
    partidoFinal.push({
      equipo_a: null,
      equipo_b: null,
      marcador1: null,
      marcador2: null,
    });
  }

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await axios.get(subcategoriasEndpoint);

        setSubcategoria(response.data);
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

    const getEliminatorias = async () => {
      try {
        const response = await axios.get(InfoEliminatorias);
        setEliminatoriasCuartos(response.data.cuartos);
        setEliminatoriasSemis(response.data.semis);

        setEliminatoriasFinal(response.data.final);
      } catch (error) {
        console.error("Error al obtener los partidos:", error);
      }
    };



    
    fetchSubcategorias();
    fetchEquipos();
    getEliminatorias();
  }, []);

  const store = async (e) => {
    e.preventDefault();

    const data = {
      marcador1,
      marcador2,
      equipo_a_id: equipoLocalID,
      equipo_b_id: equipoVisitanteID,
      numPartido,
      tipo_eliminatoria: tipoEliminatoria,
      tipo_partido: tipoPartido,
      subcategoria_id: SubcategoriaID,
    };

    try {
      await axios.post(endpoint, data);
      alert("Datos enviados exitosamente");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos");
    }
  };

  return (
    <div>
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

              {Subcategorias.map((subcategoria) => (
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

          {/* Marcador Local */}
          <div className="input-field col s12 m6">
            <label>Marcador Local</label>
            <input
              id="marcador1"
              name="marcador1"
              type="number"
              placeholder="Marcador Local"
              className="form-control validate light-blue-text"
              onChange={(e) => setMarcador1(e.target.value)}
              value={marcador1}
            />
          </div>

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

          {/* Marcador Visitante */}
          <div className="input-field col s12 m6">
            <label>Marcador Visitante</label>
            <input
              id="marcador2"
              name="marcador2"
              type="number"
              placeholder="Marcador Visitante"
              className="form-control validate light-blue-text"
              onChange={(e) => setMarcador2(e.target.value)}
              value={marcador2}
            />
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
              value={numPartido}
            />
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
            </select>
          </div>

          {/* Tipo de Partido (si ida_vuelta) */}
          {tipoEliminatoria === "ida_vuelta" && (
            <div className="input-field col s12 m6">
              <label htmlFor="tipo_partido" className="form-label">
                Tipo de Partido
              </label>
              <select
                id="tipo_partido"
                name="tipo_partido"
                className="form-control validate"
                onChange={(e) => setTipoPartido(e.target.value)}
                value={tipoPartido}
              >
                <option value="" disabled>
                  Selecciona Tipo de Partido
                </option>
                <option value="ida">Ida</option>
                <option value="vuelta">Vuelta</option>
              </select>
            </div>
          )}

          {/* Botón Enviar */}
          <div className="col s12 m12 mt-3">
            <button className="btn btn-outline-info" type="submit">
              Enviar
            </button>
          </div>
        </div>
      </form>

      <h3 className="mt-4">informacion de eliminatorias</h3>

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
                <th className="center">Cuartos de final</th>
                <th className="center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidosCuartos.map((partido, index) => (
                <tr key={index} className="fondo-card-admin">
                  <td className="center">
                    {partido.equipo_aa
                      ? partido.equipo_aa.nombre
                      : "por definir"}
                    {partido.marcador1 !== null ? partido.marcador1 : "-"}
                    {partido.marcador2 !== null ? partido.marcador2 : "-"}
                    {partido.equipo_aa
                      ? partido.equipo_b.nombre
                      : "por definir"}
                  </td>
                  <td className="center">
                    <a
                      href="{{ route('eliminatorias.reset',$partido->id)}}"
                      className="btn btn-info"
                    >
                      <i className="fas fa-sync-alt"></i> Reiniciar
                    </a>
                    <a
                      href="eliminatorias/{{$partido->id}}/edit"
                      className="btn btn-warning"
                    >
                      <i className="fas fa-pen"></i> Editar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tab-pane container fade" id="menu1">
          <table className="table">
            <thead>
              <tr>
                <th className="center">Semifinal</th>
                <th className="center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidosSemis.map((partido, index) => (
                <tr key={index} className="fondo-card-admin">
                  <td className="center">
                    {partido.equipo_aa
                      ? partido.equipo_aa.nombre
                      : "por definir"}
                    {partido.marcador1 !== null ? partido.marcador1 : "-"} -
                    {partido.marcador2 !== null ? partido.marcador2 : "-"}
                    {partido.equipo_b ? partido.equipo_b.nombre : "por definir"}
                  </td>
                  <td className="center">
                    <a
                      href="{{ route('eliminatorias.reset',$partido->id)}}"
                      className="btn btn-info"
                    >
                      <i className="fas fa-sync-alt"></i> Reiniciar
                    </a>
                    <a
                      href="eliminatorias/{{$partido->id}}/edit"
                      className="btn btn-warning"
                    >
                      <i className="fas fa-pen"></i> Editar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tab-pane container fade" id="menu2">
          <table className="table">
            <thead>
              <tr className="fondo-card-admin">
                <th className="center">Final</th>
                <th className="center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partidoFinal.map((partido, index) => (
                <tr key={index} className="fondo-card-admin">
                  <td className="center">
                    {partido.equipo_aa
                      ? partido.equipo_aa.nombre
                      : "por definir"}
                    {partido.marcador1 !== null ? partido.marcador1 : "-"}
                    {partido.marcador2 !== null ? partido.marcador2 : "-"}
                    {partido.equipo_aa
                      ? partido.equipo_b.nombre
                      : "por definir"}
                  </td>
                  <td className="center">
                    <a
                      href="{{ route('eliminatorias.reset',$partido->id)}}"
                      className="btn btn-info"
                    >
                      <i className="fas fa-sync-alt"></i> Reiniciar
                    </a>
                    <a
                      href="eliminatorias/{{$partido->id}}/edit"
                      className="btn btn-warning"
                    >
                      <i className="fas fa-pen"></i> Editar
                    </a>
                  </td>
                </tr>
              ))}
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
                {partidosCuartos.map((partido, index) => (
                  <div className="partido" key={index}>
                    <div className="jornada">
                      {/* Equipo Local */}
                      <div
                        className={`jugador ${partido.marcador1 > partido.marcador2 ? "win" : partido.marcador1 < partido.marcador2 ? "lose" : ""}`}
                      >
                        <img
                          src={`${Images}/${partido.equipo_aa?.archivo}`}
                          alt="-"
                          className="logo"
                        />
                        <span className="equipo">
                          {partido.equipo_aa
                            ? partido.equipo_aa.nombre
                            : "por definir"}
                        </span>
                        <span className="goles">
                          {partido.marcador1 !== null ? partido.marcador1 : "-"}
                        </span>
                      </div>

                      {/* Equipo Visitante */}
                      <div
                        className={`jugador ${partido.marcador2 > partido.marcador1 ? "win" : partido.marcador2 < partido.marcador1 ? "lose" : ""}`}
                      >
                        <img
                          src={`${Images}/${partido.equipo_b?.archivo}`}
                          alt=""
                          className="logo"
                        />
                        <span className="equipo">
                          {partido.equipo_b
                            ? partido.equipo_b.nombre
                            : "por definir"}
                        </span>
                        <span className="goles">
                          {partido.marcador2 !== null ? partido.marcador2 : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                {partidosSemis.map((partido, index) => (
                  <>
                    <div className="jornada" key={index}>
                      <div
                        className={`jugador ${partido.marcador1 > partido.marcador2 ? "win" : partido.marcador1 < partido.marcador2 ? "lose" : ""}`}
                      >
                        <img
                          src={`${Images}/${partido.equipo_aa?.archivo}`}
                          alt="-"
                          className="logo"
                        />
                        <span className="equipo">
                          {partido.equipo_aa
                            ? partido.equipo_aa.nombre
                            : "por definir"}
                        </span>
                        <span className="goles">
                          {partido.marcador1 !== null ? partido.marcador1 : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="jornada">
                      <div
                        className={`jugador ${partido.marcador2 > partido.marcador1 ? "win" : partido.marcador2 < partido.marcador1 ? "lose" : ""}`}
                      >
                        <img
                          src={`${Images}/${partido.equipo_b?.archivo}`}
                          alt="-"
                          className="logo"
                        />
                        <span className="equipo">
                          {partido.equipo_b
                            ? partido.equipo_b.nombre
                            : "por definir"}
                        </span>
                        <span className="goles">
                          {partido.marcador2 !== null ? partido.marcador2 : "-"}
                        </span>
                      </div>
                    </div>
                  </>
                ))}
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
                {partidoFinal.map((partido, index) => (
                  <>
                    <div className="jornada" key={index}>
                      <div className="conector_doble"></div>
                      <div className="conector_simple"></div>
                      <div
                        className={`jugador ${partido.marcador1 > partido.marcador2 ? "win" : ""}`}
                      >
                        {" "}
                        <img
                          src={`${Images}/${partido.equipo_aa?.archivo}`}
                          alt="-"
                          className="logo"
                        />
                        <span className="equipo">
                          {partido.equipo_aa
                            ? partido.equipo_aa.nombre
                            : "por definir"}
                        </span>
                        <span className="goles">
                          {partido.marcador1 !== null ? partido.marcador1 : "-"}
                        </span>
                      </div>
                    </div>
                    <div className="jornada">
                      <div className="conector_doble"></div>
                      <div className="conector_simple"></div>
                      <div
                        className={`jugador ${partido.marcador2 > partido.marcador1 ? "win" : ""}`}
                      >
                        <img
                          src={`${Images}/${partido.equipo_b?.archivo}`}
                          alt="-"
                          className="logo"
                        />
                        <span className="equipo">
                          {partido.equipo_b
                            ? partido.equipo_b.nombre
                            : "por definir"}
                        </span>
                        <span className="goles">
                          {partido.marcador2 !== null ? partido.marcador2 : "-"}
                        </span>
                      </div>
                    </div>
                  </>
                ))}
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

                  {partidoFinal[0]?.marcador1 !== null &&
                  partidoFinal[0]?.marcador2 !== null &&
                  partidoFinal[0]?.marcador1 !== partidoFinal[0]?.marcador2 ? (
                    <div
                      className={`jugador ${partidoFinal[0]?.marcador1 > partidoFinal[0]?.marcador2 ? "win" : "win"}`}
                    >
                      <img
                        src={
                          partidoFinal[0]?.marcador1 >
                          partidoFinal[0]?.marcador2
                            ? `${Images}/${partidoFinal[0].equipo_aa?.archivo}`
                            : `${Images}/${partidoFinal[0].equipo_b?.archivo}`
                        }
                        className="logo"
                        alt="sin imagen"
                      />
                      <span className="equipo equipog">
                        {partidoFinal[0]?.marcador1 > partidoFinal[0]?.marcador2
                          ? partidoFinal[0].equipo_aa?.nombre
                          : partidoFinal[0].equipo_b?.nombre}
                      </span>
                    </div>
                  ) : (
                    <div className="jugador">
                      <span className="equipo">Por definir ganador</span>
                    </div>
                  )}
                </div>

                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Eliminatorias/>
    </div>
  );
};

export default FORM_Eliminatorias;
