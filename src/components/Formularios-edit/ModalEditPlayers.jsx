/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import axios from 'axios';

const EditPlayerModal = ({ showModal, PlayerData, API_ENDPOINT, onSave, onClose }) => {
  const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

  const [subcategoriaId, setSubcategoriaId] = useState(PlayerData?.subcategoriaId || "");
  const [equiposFiltrados, setEquiposFiltrados] = useState([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(PlayerData?.equipoId || "");
  const [nombre, setNombre] = useState(PlayerData?.nombre || "");
  const [apellido, setApellido] = useState(PlayerData?.apellido || "");
  const [edad, setEdad] = useState(PlayerData?.edad || 0);
  const [numero, setNumero] = useState(PlayerData?.numero || 0);
  const [card_amarilla, setcard_amarilla] = useState(PlayerData?.card_amarilla || 0);
  const [card_roja, setcard_roja] = useState(PlayerData?.card_roja || 0);
  const [goles, setGoles] = useState(PlayerData?.goles || 0);
  const [asistencias, setAsistencias] = useState(PlayerData?.asistencias || 0);
  // eslint-disable-next-line no-unused-vars
  const [subcategorias, setSubcategorias] = useState([]);
  const [errors, setErrors] = useState({});

  // Actualiza los estados cuando PlayerData cambia
  useEffect(() => {
    console.log('PlayerData recibido: ', PlayerData);
    setSubcategoriaId(PlayerData?.subcategoriaId || "");
    setEquipoSeleccionado(PlayerData?.equipoId || "");
    setNombre(PlayerData?.nombre || "");
    setApellido(PlayerData?.apellido || "");
    setEdad(PlayerData?.edad || 0);
    setNumero(PlayerData?.numero || 0);
    setcard_amarilla(PlayerData?.card_amarilla || 0);
    setcard_roja(PlayerData?.card_roja || 0);
    setGoles(PlayerData?.goles || 0);
    setAsistencias(PlayerData?.asistencias || 0);
  }, [PlayerData]);

  // Carga subcategorías
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
  }, [subcategoriasEndpoint]);

  // Carga equipos según la subcategoría seleccionada
  useEffect(() => {
    const fetchEquiposPorSubcategoria = async () => {
      if (subcategoriaId) {
        try {
          const response = await axios.get(`${API_ENDPOINT}subcategoria/${subcategoriaId}/equipos`);
          setEquiposFiltrados(response.data);
        } catch (error) {
          console.error("Error al obtener los equipos por subcategoría:", error);
        }
      }
    };

    fetchEquiposPorSubcategoria();
  }, [subcategoriaId, API_ENDPOINT]);

  // Validación del formulario
  const validateForm = () => {
    let newErrors = {};
    if (!subcategoriaId) newErrors.subcategoriaId = "Debe seleccionar una subcategoría.";
    if (!equipoSeleccionado) newErrors.equipoSeleccionado = "Debe seleccionar un equipo.";
    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
    if (edad < 1 || edad > 99) newErrors.edad = "Edad debe estar entre 1 y 99 años.";
    if (numero < 1 || numero > 99) newErrors.numero = "Número debe estar entre 1 y 99.";
    if (card_amarilla < 0) newErrors.card_amarilla = "No puede ser negativo.";
    if (card_roja < 0) newErrors.card_roja = "No puede ser negativo.";
    if (goles < 0) newErrors.goles = "No puede ser negativo.";
    if (asistencias < 0) newErrors.asistencias = "No puede ser negativo.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guarda solo si la validación es correcta y cierra el modal
  const handleSave = () => {
    if (!validateForm()) return;
    const updatedPlayer = {
      id: PlayerData?.id,
      subcategoriaId,
      equipo_id: equipoSeleccionado,
      nombre,
      apellido,
      edad,
      numero,
      card_amarilla,
      card_roja,
      goles,
      asistencias,
    };
    onSave(updatedPlayer);
    onClose();
  };
  

  if (!showModal) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog modal-md modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Jugador</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="container-fluid">
              <div className="row">
                {/* Subcategoría */}
                <div className="col-md-6 ml-auto">
                  <div className="form-group">
                    <label htmlFor="subcategoria_id">Subcategoría:</label>
                    <select
                      id="subcategoria_id"
                      className="form-control"
                      value={subcategoriaId}
                      onChange={(e) => setSubcategoriaId(e.target.value)}
                    >
                      <option value="" disabled>
                        {subcategorias.length === 0 ? "Cargando..." : "Selecciona una subcategoría"}
                      </option>
                      {subcategorias.map((subcategoria) => (
                        <option key={subcategoria.id} value={subcategoria.id}>
                          {subcategoria.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.subcategoriaId && <small className="text-danger">{errors.subcategoriaId}</small>}
                  </div>
                </div>
                {/* Equipo */}
                <div className="col-md-6 ml-auto">
                  <div className="form-group">
                    <label htmlFor="equipo_id">Equipo:</label>
                    <select
                      id="equipo_id"
                      className="form-control"
                      value={equipoSeleccionado}
                      onChange={(e) => setEquipoSeleccionado(e.target.value)}
                    >
                      <option value="" disabled>
                        {equiposFiltrados.length === 0 ? "Cargando..." : "Selecciona un equipo"}
                      </option>
                      {equiposFiltrados.map((equipo) => (
                        <option key={equipo.id} value={equipo.id}>
                          {equipo.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.equipoSeleccionado && <small className="text-danger">{errors.equipoSeleccionado}</small>}
                  </div>
                </div>
                {/* Nombre */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Nombre:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Nombre"
                    />
                    {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                  </div>
                </div>
                {/* Apellido */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Apellido:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Apellido"
                    />
                    {errors.apellido && <small className="text-danger">{errors.apellido}</small>}
                  </div>
                </div>
                {/* Edad */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Edad:</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      className="form-control"
                      value={edad}
                      onChange={(e) => setEdad(Number(e.target.value))} 
                      placeholder="Edad"
                    />
                    {errors.edad && <small className="text-danger">{errors.edad}</small>}
                  </div>
                </div>
                {/* Número */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Número:</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      className="form-control"
                      value={numero}
                      onChange={(e) => setNumero(Number(e.target.value))}
                      placeholder="Número"
                    />
                    {errors.numero && <small className="text-danger">{errors.numero}</small>}
                  </div>
                </div>
                {/* Tarjeta Amarilla */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Tarjeta Amarilla:</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      className="form-control"
                      value={card_amarilla}
                      onChange={(e) => setcard_amarilla(Number(e.target.value))}
                      placeholder="Tarjeta Amarilla"
                    />
                    {errors.card_amarilla && <small className="text-danger">{errors.card_amarilla}</small>}
                  </div>
                </div>
                {/* Tarjeta Roja */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Tarjeta Roja:</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      className="form-control"
                      value={card_roja}
                      onChange={(e) => setcard_roja(Number(e.target.value))}
                      placeholder="Tarjeta Roja"
                    />
                    {errors.card_roja && <small className="text-danger">{errors.card_roja}</small>}
                  </div>
                </div>
                {/* Goles */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Goles:</label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      className="form-control"
                      value={goles}
                      onChange={(e) => setGoles(Number(e.target.value))}
                      placeholder="Goles"
                    />
                    {errors.goles && <small className="text-danger">{errors.goles}</small>}
                  </div>
                </div>
                {/* Asistencias */}
                <div className="col-md-6 ml-auto">
                  <div>
                    <label>Asistencias:</label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      className="form-control"
                      value={asistencias}
                      onChange={(e) => setAsistencias(Number(e.target.value))}
                      placeholder="Asistencias"
                    />
                    {errors.asistencias && <small className="text-danger">{errors.asistencias}</small>}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cerrar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
  Guardar
</button>


          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerModal;



/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */

// import { useEffect, useState } from "react";
// import axios from "axios";

// const EditPlayerModal = ({ showModal, PlayerData, API_ENDPOINT, onSave, onClose }) => {
//   const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

//   const [subcategoriaId, setSubcategoriaId] = useState(PlayerData?.subcategoriaId || "");
//   const [equiposFiltrados, setEquiposFiltrados] = useState([]);
//   const [equipoSeleccionado, setEquipoSeleccionado] = useState(PlayerData?.equipoId || "");
//   const [nombre, setNombre] = useState(PlayerData?.nombre || "");
//   const [apellido, setApellido] = useState(PlayerData?.apellido || "");
//   const [edad, setEdad] = useState(PlayerData?.edad || 0);
//   const [numero, setNumero] = useState(PlayerData?.numero || 0);
//   const [card_amarilla, setCardAmarilla] = useState(PlayerData?.card_amarilla || 0);
//   const [card_roja, setCardRoja] = useState(PlayerData?.card_roja || 0);
//   const [goles, setGoles] = useState(PlayerData?.goles || 0);
//   const [asistencias, setAsistencias] = useState(PlayerData?.asistencias || 0);
//   const [subcategorias, setSubcategorias] = useState([]);
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     setSubcategoriaId(PlayerData?.subcategoriaId || "");
//     setEquipoSeleccionado(PlayerData?.equipoId || "");
//     setNombre(PlayerData?.nombre || "");
//     setApellido(PlayerData?.apellido || "");
//     setEdad(PlayerData?.edad || 0);
//     setNumero(PlayerData?.numero || 0);
//     setCardAmarilla(PlayerData?.card_amarilla || 0);
//     setCardRoja(PlayerData?.card_roja || 0);
//     setGoles(PlayerData?.goles || 0);
//     setAsistencias(PlayerData?.asistencias || 0);
//   }, [PlayerData]);

//   useEffect(() => {
//     axios.get(subcategoriasEndpoint)
//       .then((response) => {
//         setSubcategorias(response.data);
//       })
//       .catch((error) => {
//         console.error("Error obteniendo subcategorías:", error);
//       });
//   }, [subcategoriasEndpoint]);

//   const handleSubcategoriaChange = (e) => {
//     const selectedId = e.target.value;
//     setSubcategoriaId(selectedId);
//     setEquipoSeleccionado("");

//     if (selectedId) {
//       axios.get(`${API_ENDPOINT}equipos?subcategoriaId=${selectedId}`)
//         .then((response) => {
//           setEquiposFiltrados(response.data);
//         })
//         .catch((error) => {
//           console.error("Error obteniendo equipos:", error);
//         });
//     } else {
//       setEquiposFiltrados([]);
//     }
//   };

//   const validateForm = () => {
//     let newErrors = {};
//     if (!subcategoriaId) newErrors.subcategoriaId = "Debe seleccionar una subcategoría.";
//     if (!equipoSeleccionado) newErrors.equipoSeleccionado = "Debe seleccionar un equipo.";
    
//     if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
//     if (!apellido.trim()) newErrors.apellido = "El apellido es obligatorio.";
//     if (edad < 1 || edad > 99) newErrors.edad = "Edad debe estar entre 1 y 99 años.";
//     if (numero < 1 || numero > 99) newErrors.numero = "Número debe estar entre 1 y 99.";
//     if (card_amarilla < 0) newErrors.card_amarilla = "No puede ser negativo.";
//     if (card_roja < 0) newErrors.card_roja = "No puede ser negativo.";
//     if (goles < 0) newErrors.goles = "No puede ser negativo.";
//     if (asistencias < 0) newErrors.asistencias = "No puede ser negativo.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSave = () => {
//     if (!validateForm()) return;

//     const updatedPlayer = {
//       id: PlayerData.id,
//       subcategoriaId,
//       equipoId: equipoSeleccionado,
//       nombre,
//       apellido,
//       edad,
//       numero,
//       card_amarilla,
//       card_roja,
//       goles,
//       asistencias,
//     };

//     onSave(updatedPlayer);
//   };

//   return (
//     <div className="modal" style={{ display: "block" }}>
//       <div className="modal-dialog modal-md modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">Editar Jugador</h5>
//             <button type="button" className="btn-close" onClick={onClose}></button>
//           </div>
//           <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>

//             <form>
//             <div className="container-fluid">
//             <div className="row">
//             <div className="col-md-6 ml-auto ">
//             <div className="form-group">
//                 <label className="form-label">Subcategoría</label>
//                 <select
//                   className={`form-control ${errors.subcategoriaId ? "is-invalid" : ""}`}
//                   value={subcategoriaId}
//                   onChange={(e) => setSubcategoriaId(e.target.value)}
//                 >
//                   <option value="">Seleccione una subcategoría</option>
//                   {subcategorias.map((sub) => (
//                     <option key={sub.id} value={sub.id}>{sub.nombre}</option>
//                   ))}
//                 </select>
//                 {errors.subcategoriaId && <small className="text-danger">{errors.subcategoriaId}</small>}
//               </div>
//               </div>

//               {/* Equipo */}
//               <div className="col-md-6 ml-auto mb-1">
             
//                 <label className="form-label">Equipo</label>
//                 <select
//                   className={`form-control ${errors.equipoSeleccionado ? "is-invalid" : ""}`}
//                   value={equipoSeleccionado}
//                   onChange={(e) => setEquipoSeleccionado(e.target.value)}
//                 >
//                   <option value="">Seleccione un equipo</option>
//                   {equiposFiltrados.map((equipo) => (
//                     <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
//                   ))}
//                 </select>
//                 {errors.equipoSeleccionado && <small className="text-danger">{errors.equipoSeleccionado}</small>}
             
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Nombre</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
//                   value={nombre}
//                   onChange={(e) => setNombre(e.target.value)}
//                 />
//                 {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Apellido</label>
//                 <input
//                   type="text"
//                   className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
//                   value={apellido}
//                   onChange={(e) => setApellido(e.target.value)}
//                 />
//                 {errors.apellido && <small className="text-danger">{errors.apellido}</small>}
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Edad</label>
//                 <input
//                   type="number"
//                   className={`form-control ${errors.edad ? "is-invalid" : ""}`}
//                   value={edad}
//                   onChange={(e) => setEdad(Number(e.target.value))}
//                 />
//                 {errors.edad && <small className="text-danger">{errors.edad}</small>}
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Número</label>
//                 <input
//                   type="number"
//                   className={`form-control ${errors.numero ? "is-invalid" : ""}`}
//                   value={numero}
//                   onChange={(e) => setNumero(Number(e.target.value))}
//                 />
//                 {errors.numero && <small className="text-danger">{errors.numero}</small>}
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Tarjetas Amarillas</label>
//                 <input
//                   type="number"
//                   className={`form-control ${errors.card_amarilla ? "is-invalid" : ""}`}
//                   value={card_amarilla}
//                   onChange={(e) => setCardAmarilla(Number(e.target.value))}
//                 />
//                 {errors.card_amarilla && <small className="text-danger">{errors.card_amarilla}</small>}
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Tarjetas Rojas</label>
//                 <input
//                   type="number"
//                   className={`form-control ${errors.card_roja ? "is-invalid" : ""}`}
//                   value={card_roja}
//                   onChange={(e) => setCardRoja(Number(e.target.value))}
//                 />
//                 {errors.card_roja && <small className="text-danger">{errors.card_roja}</small>}
//               </div>

//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Goles</label>
//                 <input
//                   type="number"
//                   className={`form-control ${errors.goles ? "is-invalid" : ""}`}
//                   value={goles}
//                   onChange={(e) => setGoles(Number(e.target.value))}
//                 />
//                 {errors.goles && <small className="text-danger">{errors.goles}</small>}
//               </div>
//               <div className="col-md-6 ml-auto mb-1">
//                 <label className="form-label">Asistencias</label>
//                 <input
//                   type="number"
//                   className={`form-control ${errors.asistencias ? "is-invalid" : ""}`}
//                   value={asistencias}
//                   onChange={(e) => setAsistencias(Number(e.target.value))}
//                 />
//                 {errors.asistencias && <small className="text-danger">{errors.asistencias}</small>}
//               </div>
//               </div>
//               </div>
//             </form>
//           </div>
//           <div className="modal-footer">
//           <button type="button" className="btn btn-danger" onClick={onClose}>
//                Cerrar
//              </button>            <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditPlayerModal;

