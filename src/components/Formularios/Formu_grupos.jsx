import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { API_ENDPOINT } from "../../ConfigAPI";
import ModalEdit from "../Formularios-edit/ModalEdit";
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
     
      setAlerta({ mensaje: "Grupo actualizada correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      setGrupos((prevGrupos) =>
        prevGrupos.map((g) => (g.id === updatedGrupo.id ? updatedGrupo : g))
      
      );
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      setAlerta({ mensaje: "Error al actualizar la categoria!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
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
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
        // Recargar los grupos después de eliminar
        const response = await axios.get(Infoendpoint);
        setGrupos(response.data);
      } catch (error) {
        setAlerta({ mensaje: "Error al eliminar el grupo!", tipo: "danger" });
        setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
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
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
      // Recargar los grupos después de agregar
      const response = await axios.get(Infoendpoint);
      setGrupos(response.data);
    } catch (error) {
      setAlerta({ mensaje: "Error al registrar el grupo!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 3000);
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
      <form className="col-md-12" onSubmit={store}>
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
            type="text"
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
            Enviar
          </button>
        </div>
      </form>

      {/* Tabla de grupos */}
      <div className="table-responsive card my-2">
        <table className="table">
          <thead className="thead-light">
            <tr>
              <th className="center">Subcategoría</th>
              <th className="center">Grupo</th>
              <th className="center">Clasificados</th>
              <th className="center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Grupos.map((Grupo) => (
              <tr key={Grupo.id}>
                <td className="center">{Grupo.subcategoria.nombre}</td>
                <td className="center">{Grupo.nombre}</td>
                <td className="center">{Grupo.num_clasificados}</td>
                <td className="center">
                <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setSelectedGrupo(Grupo)}
                              >Editar</button>
                  <button
                    className="btn btn-danger far fa-trash-alt delete-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteGrupo(Grupo.id);
                    }}
                  >
                    Borrar
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
/>;
      </div>
    </div>
  );
};

export default FORM_Groups;
