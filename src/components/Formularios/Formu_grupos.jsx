import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { API_ENDPOINT } from "../../ConfigAPI";
import ModalEdit from "../Formularios-edit/ModalEdit";

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';
const endpoint = `${API_ENDPOINT}grupo`;
const Infoendpoint = `${API_ENDPOINT}grupos`;
const subcategoriasEndpoint = `${API_ENDPOINT}subcategorias`;

const FORM_Groups = () => {
  const [nombre, setNombre] = useState("");
  const [num_clasificados, setNum_clasificados] = useState("");
  const [Subcategorias, setSubcategoria] = useState([]);
  const [Grupos, setGrupos] = useState([]);
  const [SubcategoriaID, setSubcategoriaID] = useState("");
  const [setError] = useState(null);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const gruposFields = [
    { name: "nombre", label: "Nombre del grupo", required: true },
    {
      name: "subcategoria_id",
      label: "Seleccionar una Subcategoria",
      type: "select",
      required: true,
      options: Subcategorias.map((Subcategoria) => ({
        value: Subcategoria.id,
        label:`${Subcategoria.nombre}`,
      })),
    },
    { name: "num_clasificados", label: "Numero de clasificados", required: true },
  ];

  const saveGrupo = async (updatedGrupo) => {
    try {
      await axios.put(`${API_ENDPOINT}grupo/${updatedGrupo.id}`, updatedGrupo);
     
      setAlerta({ mensaje: "Grupo actualizado correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      setGrupos((prevGrupos) =>
        prevGrupos.map((g) => (g.id === updatedGrupo.id ? updatedGrupo : g))
      
      );
    } catch (error) {
      console.error("Error al actualizar el Grupo:", error);
      setAlerta({ mensaje: "Error al actualizar el Grupo!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };

  // Cargar subcategorías y grupos al cargar la página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subcategoriasRes, gruposRes] = await Promise.all([
          axios.get(subcategoriasEndpoint),
          axios.get(Infoendpoint),
        ]);
        setSubcategoria(subcategoriasRes.data);
        setGrupos(gruposRes.data);
      } catch (error) {
        setError("Error al cargar los datos.");
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.title = "Admin - Grupos";
  }, []);


  // Eliminar un grupo
  const deleteGrupo = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este grupo?")) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setAlerta({ mensaje: "Grupo eliminado correctamente!", tipo: "success" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        // Recargar los grupos después de eliminar
        const response = await axios.get(Infoendpoint);
        setGrupos(response.data);
      } catch (error) {
        setAlerta({ mensaje: "Error al eliminar el grupo!", tipo: "danger" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        setError("Error al eliminar el grupo.");
        console.error("Error al eliminar el grupo:", error);
      }
    }
  };

  // Guardar un nuevo grupo
  const store = async (e) => {
    e.preventDefault();
    try {
      await axios.post(endpoint, { nombre,num_clasificados , subcategoria_id: SubcategoriaID });
      setNombre("");
      setSubcategoriaID("");
      setAlerta({ mensaje: "Grupo registrado con éxito!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      // Recargar los grupos después de agregar
      const response = await axios.get(Infoendpoint);
      setGrupos(response.data);
    } catch (error) {
      setAlerta({ mensaje: "Error al registrar el grupo!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      setError("Error al guardar el grupo.");
      console.error("Error al guardar el grupo", error);
    }
  };

  return (
    <div className="w-100">
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
      <h1 className="text-left">Registro de Grupos</h1>
    
      
      {/* Formulario para agregar un grupo */}
      <form className="col-md-12" onSubmit={store} autoComplete="off">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Grupo:</label>
          <input
            type="text"
            className="form-control form-input-admin"
            id="nombre"
            placeholder="Ingrese el nombre del grupo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="nombre">Numero de clasificados:</label>
          <input
           type="number"
           min={1}
           max={50} 
            className="form-control form-input-admin"
            id="nombre"
            placeholder="Ingrese el nombre del grupo"
            value={num_clasificados}
            onChange={(e) => setNum_clasificados(e.target.value)}
          />
        </div>

        <div className="form-group mt-3">
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
            {Subcategorias.map((subcategoria) => (
              <option key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex mt-2 mb-2">
          <button className="btn btn-outline-primary" type="submit">
          Registrar Grupo
          </button>
        </div>
      </form>

      {/* Tabla de grupos */}
      <div className="table-responsive card my-2">
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th className="text-center">Subcategoría</th>
              <th className="text-center">Grupo</th>
              <th className="text-center">Clasificados</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Grupos.map((Grupo) => (
              <tr key={Grupo.id}>
                <td className="text-center">{Grupo.subcategoria.nombre}</td>
                <td className="text-center">{Grupo.nombre}</td>
                <td className="text-center">{Grupo.num_clasificados}</td>
                <td className="text-center d-flex justify-content-evenly">
                <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setSelectedGrupo(Grupo)}
                              ><CreateIcon/></button>
                  <button
                    className="btn btn-danger far fa-trash-alt delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteGrupo(Grupo.id);
                    }}
                  >
                     <DeleteOutlineIcon/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ModalEdit
  data={selectedGrupo}
  type="Grupo"
  fields={gruposFields}
  onSave={saveGrupo}
/>
      </div>
    </div>
  );
};

export default FORM_Groups;
