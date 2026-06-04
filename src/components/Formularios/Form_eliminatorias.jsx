/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */

import React, { useCallback, useEffect, useState, useMemo } from "react";
import axios from "axios";

import { API_ENDPOINT, IMAGES_URL } from "../../ConfigAPI";
import EditPlayOffsModal from "../Formularios-edit/ModalEditPlayOffs";
import Swal from "sweetalert2";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreateIcon from "@mui/icons-material/Create";
import ErrorLogo from "./../../assets/Vector.svg";
import MatchEventsModal from "./MatchEventsModal";
import TablaEliminatoria from "./Tabla_Eliminatorias";
import  PruebaElim from "./../Admin/pruebaElim"


const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;
const endpoint = `${API_ENDPOINT}eliminatoria`;
const Images = IMAGES_URL;



const FORM_Eliminatorias = () => {


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



  
  const [activeTab, setActiveTab] = useState('octavos');
  const [marcadores, setMarcadores] = useState({
    marcador1_ida: "",
    marcador2_ida: "",
    marcador1_vuelta: "",
    marcador2_vuelta: "",
    marcador1_penales: "",
    marcador2_penales: "",
  });

  const [showEvents, setShowEvents] = useState(false);
const [selectedMatch, setSelectedMatch] = useState(null);
const [currentInstancia, setCurrentInstancia] = useState("normal");

// Función para abrir el modal desde cualquier tabla
const openEventsModal = (partido, instancia = "normal") => {
  setSelectedMatch(partido);
  setCurrentInstancia(instancia);
  setShowEvents(true);
};

  const [numPartido, setNumPartido] = useState("");
  const [tipoEliminatoria, setTipoEliminatoria] = useState("solo_ida");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [equipoVisitanteID, setEquipoVisitante] = useState("");
  const [equipoLocalID, setEquipoLocal] = useState("");

  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [nombreFase, setNombreFase] = useState("General");
  const [eliminatoriasOctavos, setEliminatoriasOctavos] = useState([]);

  const [eliminatoriasCuartos, setEliminatoriasCuartos] = useState([]);
  const [eliminatoriasSemis, setEliminatoriasSemis] = useState([]);
  const [eliminatoriasFinal, setEliminatoriasFinal] = useState([]);
  const [eliminatoriastercerPuesto, setEliminatoriastercerPuesto] = useState(
    [],
  );
    const [eliminatoriasdieciseisavos, setEliminatoriasdieciseisavos] = useState(
    [],
  );

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

  const fasesData = useMemo(() => {
    // Juntamos todos los partidos de los estados
    const todas = [
      ...eliminatoriasOctavos,
      ...eliminatoriasCuartos,
      ...eliminatoriasSemis,
      ...eliminatoriasFinal,
      ...eliminatoriastercerPuesto,
        ...eliminatoriasdieciseisavos,
    ];
    const fases = {};

    todas.forEach((partido) => {
      // Es vital que el backend envíe 'nombre_fase'
      const nombre = partido.nombre_fase || "General";

      if (!fases[nombre]) {
        fases[nombre] = {
          octavos: [],
          cuartos: [],
          semis: [],
          final: [],
          tercer_puesto: [],
           dieciseisavos: [],
        };
      }

      const num = parseInt(partido.numPartido, 10);
      if (num === 1) fases[nombre].octavos.push(partido);
      else if (num === 2) fases[nombre].cuartos.push(partido);
      else if (num === 3) fases[nombre].semis.push(partido);
      else if (num === 4) fases[nombre].final.push(partido);
      else if (num === 5) fases[nombre].tercer_puesto.push(partido);
        else if (num === 6) fases[nombre].dieciseisavos.push(partido);
    });

    // Rellenar espacios vacíos por CADA fase individualmente
    Object.keys(fases).forEach((nombre) => {
        // Relleno para Octavos (8 partidos)
       while (
        fases[nombre].dieciseisavos.length < 16 &&
        fases[nombre].dieciseisavos.length > 0
      ) {
        fases[nombre].dieciseisavos.push({});
      }
      // Relleno para Octavos (8 partidos)
      while (
        fases[nombre].octavos.length < 8 &&
        fases[nombre].octavos.length > 0
      ) {
        fases[nombre].octavos.push({});
      }
      // Relleno para Cuartos (4 partidos)
      while (
        fases[nombre].cuartos.length < 4 &&
        fases[nombre].cuartos.length > 0
      ) {
        fases[nombre].cuartos.push({});
      }
      // Relleno para Semis (2 partidos)
      while (fases[nombre].semis.length < 2 && fases[nombre].semis.length > 0) {
        fases[nombre].semis.push({});
      }
      while (fases[nombre].final.length < 1 && fases[nombre].final.length > 0) {
        fases[nombre].final.push({});
      }
      while (
        fases[nombre].tercer_puesto.length < 1 &&
        fases[nombre].tercer_puesto.length > 0
      ) {
        fases[nombre].tercer_puesto.push({});
      }
    });

    console.log("Fases detectadas:", Object.keys(fases));
    return fases;
  }, [
    eliminatoriasOctavos,
    eliminatoriasCuartos,
    eliminatoriasSemis,
    eliminatoriasFinal,
    eliminatoriastercerPuesto,
    eliminatoriasdieciseisavos,
  ]);

  const handleSubcategoriaChange = (e) => {
    setSelectedSubcategoria(e.target.value);
  };

  const getEliminatorias = useCallback(async () => {
    if (selectedSubcategoria) {
      try {
        const response = await axios.get(
          `${API_ENDPOINT}eliminatoria/subcategoria/${selectedSubcategoria}`,
        );
        const data = response.data; // El objeto con fases

        // Aplanamos para repartir en los estados que alimentan al useMemo
        const todos = Object.values(data).flatMap((fase) => [
          ...(fase.octavos || []),
          ...(fase.cuartos || []),
          ...(fase.semis || []),
          ...(fase.final || []),
          ...(fase.tercer_puesto || []),
            ...(fase.dieciseisavos || []),
        ]);
         setEliminatoriasdieciseisavos(
          todos.filter((p) => parseInt(p.numPartido) === 6),
        );

        setEliminatoriasOctavos(
          todos.filter((p) => parseInt(p.numPartido) === 1),
        );
        setEliminatoriasCuartos(
          todos.filter((p) => parseInt(p.numPartido) === 2),
        );
        setEliminatoriasSemis(
          todos.filter((p) => parseInt(p.numPartido) === 3),
        );
        setEliminatoriasFinal(
          todos.filter((p) => parseInt(p.numPartido) === 4),
        );
        setEliminatoriastercerPuesto(
          todos.filter((p) => parseInt(p.numPartido) === 5),
        );
      } catch (error) {
        console.error("Error al obtener los partidos:", error);
      }
    }
  }, [selectedSubcategoria]);

  // El useEffect ahora es simple:
  useEffect(() => {
    getEliminatorias();
  }, [getEliminatorias]); // La dependencia es la función misma

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
          const response = await axios.get(
            `${API_ENDPOINT}subcategoria/${SubcategoriaID}/equipos`,
          );
          setEquiposFiltrados(response.data); // Actualiza el estado con los equipos filtrados
        } catch (error) {
          console.error(
            "Error al obtener los equipos por subcategoría:",
            error,
          );
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
      ida: tipoEliminatoria === "ida_vuelta" || tipoEliminatoria === "solo_ida",
      vuelta: tipoEliminatoria === "ida_vuelta",
      penales: tipoEliminatoria === "penales",
    });
  }, [tipoEliminatoria]);

  const handleMarcadorChange = (e) => {
    const { name, value } = e.target;
    setMarcadores((prevMarcadores) => ({
      ...prevMarcadores,
      [name]: value,
    }));
  };

  const store = async (e) => {
    e.preventDefault();

    if (
      equipoLocalID !== "" &&
      equipoVisitanteID !== "" &&
      equipoLocalID === equipoVisitanteID
    ) {
      Swal.fire({
        title: "Los equipos no pueden ser el mismo!",
        text: "Seleccione 2 equipos diferentes para registrar el partido",
        icon: "warning",
        cancelButtonText: "Cancelar",
      });
      return;
    }

    // Convertir numPartido a número y verificar que sea válido
    const partidoNumero = parseInt(numPartido, 10);
    if (isNaN(partidoNumero)) {
      alert("El número de partido es inválido");
      return;
    }

    // Definir los límites por fase ( numPartido)
    const limitesRondas = {
       6: 16, // Cuartos de final
      1: 8, // Cuartos de final
      2: 4, // Cuartos de final
      3: 2, // Semifinales
      4: 1, // Final
      5: 1, //tercer puesto
    };

    const maxRegistros = limitesRondas[partidoNumero];
    if (!maxRegistros) {
      alert("El número de partido no corresponde a ninguna etapa válida.");
      return;
    }

    const todasEliminatorias = [
      ...eliminatoriasOctavos,
      ...eliminatoriasCuartos,
      ...eliminatoriasSemis,
      ...eliminatoriasFinal,
      ...eliminatoriastercerPuesto,
      ...eliminatoriasdieciseisavos,
    ];

    // Filtrar registros actuales según subcategoria_id, numPartido Y nombreFase
    const registrosFiltrados = todasEliminatorias.filter(
      (registro) =>
        parseInt(registro.numPartido, 10) === partidoNumero &&
        parseInt(registro.subcategoria_id, 10) ===
          parseInt(SubcategoriaID, 10) &&
        (registro.nombre_fase || "") === (nombreFase || ""),
    );

    // Validar el límite de registros antes de proceder
    if (registrosFiltrados.length >= maxRegistros) {
      Swal.fire({
        title: "Advertencia",
        text: `No puedes registrar más de ${maxRegistros} partidos para esta ronda en la subcategoría seleccionada.`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Preparar los datos para el backend
    const data = {
      ...marcadores,
      equipo_a_id: equipoLocalID,
      equipo_b_id: equipoVisitanteID,
      numPartido: partidoNumero,
      tipo_eliminatoria: tipoEliminatoria,
      // Cambiamos null por "General" (o el nombre que prefieras para la fase única)
      nombre_fase: nombreFase.trim() === "" ? "General" : nombreFase,
      subcategoria_id: parseInt(SubcategoriaID, 10),
    };

    console.log("Datos enviados al backend:", data);

    try {
      // Enviar datos al backend
      const response = await axios.post(endpoint, data);
      console.log("Respuesta del servidor:", response.data);

      // 1. Recargar las eliminatorias (vienen agrupadas por fase)
      const getResponse = await axios.get(
        `${API_ENDPOINT}eliminatoria/subcategoria/${SubcategoriaID}`,
      );
      const dataAgrupada = getResponse.data;

      // 2. todos los partidos de todas las fases en una sola lista
      const todos = Object.values(dataAgrupada).flatMap((fase) => [
        ...(fase.octavos || []),
        ...(fase.cuartos || []),
        ...(fase.semis || []),
        ...(fase.final || []),
        ...(fase.tercer_puesto || []),
         ...(fase.dieciseisavos || []), 
      ]);

      // 3. REPARTIR en los estados locales filtrando por numPartido
        setEliminatoriasdieciseisavos(
        todos.filter((p) => parseInt(p.numPartido) === 6),
      );
      setEliminatoriasOctavos(
        todos.filter((p) => parseInt(p.numPartido) === 1),
      );
      setEliminatoriasCuartos(
        todos.filter((p) => parseInt(p.numPartido) === 2),
      );
      setEliminatoriasSemis(todos.filter((p) => parseInt(p.numPartido) === 3));
      setEliminatoriasFinal(todos.filter((p) => parseInt(p.numPartido) === 4));
      setEliminatoriastercerPuesto(
        todos.filter((p) => parseInt(p.numPartido) === 5),
      );

      setAlerta({
        mensaje: "¡Partido registrado correctamente!",
        tipo: "success",
      });

      // Limpieza de campos
      setMarcadores({}); // Si es un objeto, mejor resetearlo así
      setEquipoVisitante("");
      setEquipoLocal("");

      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 2000);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setAlerta({ mensaje: "¡Error al registrar el partido!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };

  // borrar
  const deleteEliminatoria = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar esta Eliminatoria después de eliminarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${endpoint}/${id}`);

          await getEliminatorias();

          setAlerta({
            mensaje: "Partido eliminado con éxito!",
            tipo: "success",
          });

          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        } catch (error) {
          console.error("Error al eliminar el Partido", error);
          setAlerta({
            mensaje: "Error al eliminar el Partido.",
            tipo: "danger",
          });
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
          Swal.fire("Error", "No se pudo eliminar el Partido.", "error");
        }
      }
    });
  };



  const saveEliminatoria = async (updatedEliminatoria) => {
    console.log("Datos enviados al back:", updatedEliminatoria);
    try {
      await axios.put(
        `${API_ENDPOINT}eliminatoria/${updatedEliminatoria.id}`,
        updatedEliminatoria,
      );

      setAlerta({
        mensaje: "¡Partido actualizado correctamente!",
        tipo: "success",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);

      // 1. Obtener la respuesta agrupada
      const response = await axios.get(
        `${API_ENDPOINT}eliminatoria/subcategoria/${selectedSubcategoria}`,
      );
      const dataAgrupada = response.data;

      // 2. UNIR todos los partidos de todas las fases en una sola lista
      const todosLosPartidos = Object.values(dataAgrupada).flatMap((fase) => [
        ...(fase.octavos || []),
        ...(fase.cuartos || []),
        ...(fase.semis || []),
        ...(fase.final || []),
        ...(fase.tercer_puesto || []), 
           ...(fase.dieciseisavos || []), 
      ]);

      // 3. REPARTIR en los estados filtrando por el numPartido
       setEliminatoriasdieciseisavos(
        todosLosPartidos.filter((p) => parseInt(p.numPartido) === 6),
      );
      setEliminatoriasOctavos(
        todosLosPartidos.filter((p) => parseInt(p.numPartido) === 1),
      );
      setEliminatoriasCuartos(
        todosLosPartidos.filter((p) => parseInt(p.numPartido) === 2),
      );
      setEliminatoriasSemis(
        todosLosPartidos.filter((p) => parseInt(p.numPartido) === 3),
      );
      setEliminatoriasFinal(
        todosLosPartidos.filter((p) => parseInt(p.numPartido) === 4),
      );
      setEliminatoriastercerPuesto(
        todosLosPartidos.filter((p) => parseInt(p.numPartido) === 5),
      );
    } catch (error) {
      console.error("Error al actualizar eliminatoria:", error);
      setAlerta({
        mensaje: "¡Error al actualizar el partido!",
        tipo: "danger",
      });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };



  

  useEffect(() => {
    document.title = "Admin - Eliminatorias";
  }, []);
  return (  
    <>
      <div>
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
            <div className="col-12 col-md-6 mb-3">
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
                  <option
                    key={subcategoria.id}
                    value={subcategoria.id}
                    className="text-capitalize"
                  >
                    {subcategoria.nombre} -{" "}
                    {subcategoria.categoria?.torneo?.nombre}
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
                <option value="">Selecciona un Equipo</option>
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
                <option value="">Selecciona un Equipo</option>
                {equiposFiltrados.map((equipo) => (
                  <option key={equipo.id} value={equipo.id}>
                    {equipo.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* fase */}
            {/* Campo Fase con Select */}
            <div className="col-12 col-md-6 mb-3">
              <label htmlFor="nombrefase">Fase:</label>
              <select
                id="nombrefase"
                className="form-control form-input-admin"
                value={nombreFase}
                onChange={(e) => setNombreFase(e.target.value)}
              >
                {/* Cambia value="" por value="General" */}
                <option value="General">General / Única</option>
                {/* <option value="Copa Oro">Copa Oro</option>
                <option value="Copa Plata">Copa Plata</option>
                <option value="Copa Bronce">Copa Bronce</option> */}
              </select>
              <small className="text-muted">
                Selecciona si el torneo tiene llaves simultáneas.
              </small>
            </div>

            {/* Ronda */}
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
                 <option value="6">Dieciseisavos</option>
                <option value="1">Octavos</option>
                <option value="2">Cuartos</option>
                <option value="3">Semifinal</option>
                <option value="4">Final</option>
                <option value="5">Tercer puesto</option>
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
                <div className="col-6 mb-3">
                  <label className="form-label">Marcador Local (Ida)</label>
                  <input
                    className="form-control validate"
                    name="marcador1_ida"
                    type="number"
                    min={0}
                    max={100}
                    placeholder=" Ej: 5"
                    value={marcadores.marcador1_ida}
                    onChange={handleMarcadorChange}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Marcador Visitante (Ida)</label>
                  <input
                    className="form-control validate"
                    name="marcador2_ida"
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Ej: 4"
                    value={marcadores.marcador2_ida}
                    onChange={handleMarcadorChange}
                  />
                </div>
              </>
            )}

            {/* Si se muestran campos para vuelta */}
            {fieldsToShow.vuelta && (
              <>
                <div className="col-6 mb-3">
                  <label className="form-label">Marcador Local (Vuelta)</label>
                  <input
                    className="form-control validate"
                    name="marcador1_vuelta"
                    type="number"
                    min={0}
                    max={20}
                    placeholder="Ej: 2"
                    value={marcadores.marcador1_vuelta}
                    onChange={handleMarcadorChange}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">
                    Marcador Visitante (Vuelta)
                  </label>
                  <input
                    className="form-control validate"
                    name="marcador2_vuelta"
                    type="number"
                    min={0}
                    max={20}
                    placeholder="Ej: 5"
                    value={marcadores.marcador2_vuelta}
                    onChange={handleMarcadorChange}
                  />
                </div>
              </>
            )}

            {/* Si se muestran campos para penales */}
            {fieldsToShow.penales && (
              <>
                <div className="col-6 mb-3">
                  <label className="form-label">Penales Local</label>
                  <input
                    className="form-control validate"
                    name="marcador1_penales"
                    type="number"
                    min={0}
                    max={20}
                    placeholder="Ej: 5"
                    value={marcadores.marcador1_penales}
                    onChange={handleMarcadorChange}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Penales Visitante</label>
                  <input
                    className="form-control validate"
                    name="marcador2_penales"
                    type="number"
                    min={0}
                    max={20}
                    placeholder="Ej: 6"
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

        <select
          id="subcategoria"
          className="form-control"
          onChange={handleSubcategoriaChange}
        >
          <option value="">Seleccione una subcategoría</option>
          {subcategorias.map((subcategoria) => (
            <option key={subcategoria.id} value={subcategoria.id}>
              {subcategoria.nombre} - {subcategoria.categoria?.torneo?.nombre}
            </option>
          ))}
        </select>

        <ul className="nav nav-pills mt-4 mb-3">
           <li className="nav-item">
    <button
      className={`nav-link ${activeTab === 'dieciseisavos' ? 'active' : ''}`}
      onClick={() => setActiveTab('dieciseisavos')}
    >
      Dieciseisavos
    </button>
  </li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeTab === 'octavos' ? 'active' : ''}`}
      onClick={() => setActiveTab('octavos')}
    >
      Octavos
    </button>
  </li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeTab === 'cuartos' ? 'active' : ''}`}
      onClick={() => setActiveTab('cuartos')}
    >
      Cuartos
    </button>
  </li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeTab === 'semis' ? 'active' : ''}`}
      onClick={() => setActiveTab('semis')}
    >
      Semis
    </button>
  </li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeTab === 'final' ? 'active' : ''}`}
      onClick={() => setActiveTab('final')}
    >
      Final
    </button>
  </li>
  <li className="nav-item">
    <button
      className={`nav-link ${activeTab === 'tercer_puesto' ? 'active' : ''}`}
      onClick={() => setActiveTab('tercer_puesto')}
    >
      Tercer puesto
    </button>
  </li>
</ul>

       <div className="tab-content">
  {/* Solo se muestra si el tab activo es 'octavos' */}
  {activeTab === 'octavos' && (
          
          <TablaEliminatoria
            titulo="Octavos de final"
            rondasKey="octavos"
            fasesData={fasesData}
            eliminatorias={eliminatoriasOctavos}
            handleEditClick={handleEditClick}
            handleEventsClick={openEventsModal}
            deleteEliminatoria={deleteEliminatoria}
          />
          )}
{activeTab === 'cuartos' && (
          <TablaEliminatoria
            titulo="Cuartos de final"
            rondasKey="cuartos"
            fasesData={fasesData}
            eliminatorias={eliminatoriasCuartos}
            handleEditClick={handleEditClick}
            handleEventsClick={openEventsModal}
            deleteEliminatoria={deleteEliminatoria}
          />
  )}
  {activeTab === 'semis' && (
          <TablaEliminatoria
            titulo="Semifinal"
            rondasKey="semis"
            fasesData={fasesData}
            eliminatorias={eliminatoriasSemis}
            handleEditClick={handleEditClick}
            handleEventsClick={openEventsModal}
            deleteEliminatoria={deleteEliminatoria}
          />
)}
 {activeTab === 'final' && (
          <TablaEliminatoria
            titulo="Final"
            rondasKey="final"
            fasesData={fasesData}
            eliminatorias={eliminatoriasFinal}
            handleEditClick={handleEditClick}
            handleEventsClick={openEventsModal}
            deleteEliminatoria={deleteEliminatoria}
          />
          )}
           {activeTab === 'tercer_puesto' && (
           <TablaEliminatoria
            titulo="Tercer puesto"
            rondasKey="tercer_puesto"
            fasesData={fasesData}
            eliminatorias={eliminatoriastercerPuesto}
            handleEditClick={handleEditClick}
            handleEventsClick={openEventsModal}
            deleteEliminatoria={deleteEliminatoria}
          />
            )}
             {activeTab === 'dieciseisavos' && (
           <TablaEliminatoria
            titulo="Dieciseisavos"
            rondasKey="dieciseisavos"
            fasesData={fasesData}
            eliminatorias={eliminatoriasdieciseisavos}
            handleEditClick={handleEditClick}
            handleEventsClick={openEventsModal}
            deleteEliminatoria={deleteEliminatoria}
          />
            )}

<MatchEventsModal
  showModal={showEvents}
  /* Si tiene numPartido, es una eliminatoria. 
     Si NO tiene numPartido, es un partido de liga.
  */
  partidoId={!selectedMatch?.numPartido ? selectedMatch?.id : null}
  eliminatoriaId={selectedMatch?.numPartido ? selectedMatch?.id : null}
  instancia={currentInstancia}
  API_ENDPOINT={API_ENDPOINT}
  onClose={() => setShowEvents(false)}
/>

          <EditPlayOffsModal
            showModal={showModal}
            onClose={handleCloseModal}
            PlayOffsData={selectedPartido}
            API_ENDPOINT={API_ENDPOINT}
            onSave={saveEliminatoria}
          />
        </div>

        {/* Esquema de eliminatorias */}

        <div className="col-sm-12 col-md-12 mt-4">
          <div className="card mt-2 border-0 shadow">
            <div className="card-header fondo-card-admin TITULO-admin border-0">
              Eliminatorias
            </div>

            {Object.entries(fasesData).map(([nombreFase, rondas]) => (
              <div key={nombreFase} className="fase-contenedor mb-5">
                {/* Título de la Fase */}
                <h3
                  className="text-center text-uppercase fw-bold py-3"
                  style={{ background: "#1b58965a" }}
                >
                  {nombreFase}
                </h3>

                
                 
                 
                  
                  
                  
                
                <div>
             
<PruebaElim
  rondas={rondas}
  Images={Images}
  ErrorLogo={ErrorLogo}
  abreviarNombre={abreviarNombre}
/>

                 <div className="d-flex flex-column align-items-center mb-4">
  {/* 1. Título */}
  {rondas.tercer_puesto.length > 0 && (
    <div className="titulo mb-2">Tercer puesto</div>
  )}

 {rondas.tercer_puesto.map((partido, index) => {
    // 1. Cálculos de lógica antes del return
    const m1_ida = partido.marcador1_ida || 0;
    const m1_vuelta = partido.marcador1_vuelta;
    const m2_ida = partido.marcador2_ida || 0;
    const m2_vuelta = partido.marcador2_vuelta;

    const global1 = m1_vuelta !== null ? m1_ida + m1_vuelta : m1_ida;
    const global2 = m2_vuelta !== null ? m2_ida + m2_vuelta : m2_ida;

    // 2. Retorno del JSX
    return (
      <div key={partido.id || index} className="partido-card">
        {/* Equipo Local */}
        <div className="jugador mt-2">
          <span className="equipo">
            {partido.equipo_aa?.nombre || "Por Definir"}
          </span>
          <span className="goles">
            {m1_ida} {m1_vuelta !== null ? `- ${m1_vuelta}` : ""}
            {m1_vuelta !== null && ` (${global1})`}
            {partido.marcador1_penales && ` (${partido.marcador1_penales})`}
          </span>
        </div>

        <strong className="text-center d-block mt-1"> VS </strong>

        {/* Equipo Visitante */}
        <div className="jugador mt-1">
          <span className="equipo">
            {partido.equipo_b?.nombre || "Por Definir"}
          </span>
          <span className="goles">
            {m2_ida} {m2_vuelta !== null ? `- ${m2_vuelta}` : ""}
            {m2_vuelta !== null && ` (${global2})`}
            {partido.marcador2_penales && ` (${partido.marcador2_penales})`}
          </span>
        </div>
      </div>
    );
  })}
</div>

       
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FORM_Eliminatorias;
