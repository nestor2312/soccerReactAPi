import { useEffect, useState } from "react";
import axios from "axios";

import { API_ENDPOINT } from '../../ConfigAPI';
import "./index.css";
import ModalEdit from "../Formularios-edit/ModalEdit";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CreateIcon from '@mui/icons-material/Create';
import Swal from "sweetalert2";
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";
const endpoint = `${API_ENDPOINT}subcategoria`;

const CategoriaEndpoint = `${API_ENDPOINT}categorias`;
const TorneoEndpoint = `${API_ENDPOINT}torneos`;
const InfoSubCategorias_endpoint_paginador = `${API_ENDPOINT}subcategoriasp`;


const FORM_Subcategoria = () => {
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [CategoriaID, setCategoriaID] = useState("");
  const [Categorias, setCategorias] = useState([]);
  const [selectedSubcategoria, setSelectedSubcategoria] = useState(null);
  const [Subcategorias, setSubcategorias] = useState([]);
  const [Torneos, setTorneos] = useState([]);
 
  const [setError] = useState(null);
  const [error] = useState(null);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const [currentPage, setCurrentPage] = useState(1);

  const [lastPage, setLastPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setIsLoading(true);
  };


  const subcategoriaFields = [
    { name: "nombre", label: "Nombre de la Subcategoria", required: true },
    {
      name: "categoria_id",
      label: "Seleccionar una Categoria",
      type: "select",
      required: true,
      options: Categorias.map((categoria) => ({
        value: categoria.id,
        label:`${categoria.nombre} - ${categoria.torneo.nombre}`,
      })),
    },
  ];

  const saveSubcategoria = async (updatedSubcategoria) => {
    console.log('datos enviados al back en update =', updatedSubcategoria)
    try {
      await axios.put(`${API_ENDPOINT}subcategoria/${updatedSubcategoria.id}`, updatedSubcategoria);
      InfoSubcategoriasp(); 
      setAlerta({ mensaje: "Subcategoria actualizada correctamente!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      setTorneos((prevSubcategorias) =>
        prevSubcategorias.map((c) => (c.id === updatedSubcategoria.id ? updatedSubcategoria : c))
      
      );
    } catch (error) {
      console.error("Error al actualizar la categoria:", error);
      setAlerta({ mensaje: "Error al actualizar la categoria!", tipo: "danger" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
    }
  };

  // Fetch torneos, categorias y subcategorias al cargar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(CategoriaEndpoint);
        setCategorias(response.data);

      } catch (error) {
        setError("Error al cargar los categorias.");
        console.error("Error al obtener los categorias:", error);
      }
    };

    const fetchTorneos = async () => {
      try {
        const response = await axios.get(TorneoEndpoint);
        setTorneos(response.data);
      } catch (error) {
        setError("Error al cargar los torneos.");
        console.error("Error al obtener los torneos:", error);
      }
    };

    
    fetchCategorias();
    fetchTorneos();
   
  }, []);
  
  

  const InfoSubcategoriasp = async () => {
    try {
      const response = await axios.get(`${InfoSubCategorias_endpoint_paginador}?page=${currentPage}`);
      setSubcategorias(response.data.data);
      setLastPage(response.data.last_page);
      setIsLoading(false);
      // setLastPage(response.data.last_page);
    } catch (error) {
      setIsLoading(false);
      setError("Error al cargar los subcategorias.");
      console.error("Error al obtener los subcategorias:", error);
    }
  };
  // Manejo del envío del formulario
  const store = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(endpoint, { nombre, categoria_id: CategoriaID });
      InfoSubcategoriasp();
      setAlerta({ mensaje: "Subcategoria registrada con éxito!", tipo: "success" });
      setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
      setNombre("");
      setCategoriaID("");
    } catch (error) {
      console.error('Error al guardar la subcategoría', error);
    }finally {
      setIsLoading(false); 
    }
  };

  const deleteSubcategoria = async (id) => {

    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar esta subcategoria después de eliminarla.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${endpoint}/${id}`);
  setSubcategorias(Subcategorias.filter((Subcategoria) => Subcategoria.id !== id));
  setAlerta({ mensaje: "Subcategoria eliminada correctamente!", tipo: "success" });
  InfoSubcategoriasp();
  setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
        
        } catch (error) {
          console.error("Error al eliminar el torneo", error);
          setAlerta({ mensaje: "Error al eliminar la Subcategoria!", tipo: "success" });
          setTimeout(() => setAlerta({ mensaje: "", tipo: "" }), 6000);
          Swal.fire("Error", "No se pudo eliminar el torneo.", "error");
        } 
      }
    });

  
  };

  useEffect(() => {
    document.title = "Admin - Subcategoria";
  }, []);


  useEffect(() => {

    InfoSubcategoriasp();
  }, [currentPage]);


  return (
    <>
    {isLoading ? (
      <div className="loading-container">
        <Cargando/>
      </div>
    ) :  error ? (
      <div className="loading-container">
         <ErrorCarga/>
      </div>
    ) : (
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
      <h1 className="text-left ">Registro de Subcategorias</h1>
      <div>
        <form className="col-md-12 mt-2 mb-4" onSubmit={store} autoComplete="off">
          <div className="form-group">
            <label htmlFor="nombre">Nombre de la Subcategoria:</label>
            <input
             required
              type="text"
              className="form-control form-input-admin"
              id="nombre"
              placeholder="Aficionado, Sub 17, Juvenil"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Selector de categoria */}
          <div className="form-group mt-3">
            <label htmlFor="grupo_id">Selecciona una categoría:</label>
            <select
             required
              id="grupo_id"
              className="form-control"
              value={CategoriaID}
              onChange={(e) => setCategoriaID(e.target.value)}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {Categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre} - {categoria.torneo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Botón para enviar el formulario */}
          <div className="d-flex mt-2 mb-2">
            <button className="btn btn-outline-primary" type="submit">
            Registrar Subcategoria
            </button>
          </div>
        </form>
      </div>

      {/* Tabla para mostrar las subcategorías */}

     


      <div>  
        <div className="table-responsive card my-2">   
          <table className="table ">
            <thead className="thead-light">
              <tr>
                <th className="text-left">Subcategoria</th>
                <th className="text-left">Categoria</th>
                <th className="text-left">Torneo</th>
                <th className="text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Subcategorias.map((subcategoria) => (
                <tr key={subcategoria.id}>
                  <td className="center">{subcategoria.nombre}</td>
                  <td className="center">{subcategoria.categoria.nombre}</td>
                  <td className="center">
                    {Torneos.find(torneo => torneo.id === subcategoria.categoria.torneo_id)?.nombre || "No disponible"}
                  </td>
                  <td className="text-center d-flex justify-content-evenly">
                  <button
                                type="button"
                                className="btn btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setSelectedSubcategoria(subcategoria)}
                              ><CreateIcon/></button>
                    
                    <button
                      className="btn btn-danger far fa-trash-alt delete-btn"
                      onClick={() => deleteSubcategoria(subcategoria.id)}
                    > <DeleteOutlineIcon/>
                    
                    </button>
                  </td>
                </tr>   
              ))}
            </tbody>
          </table>
          <ModalEdit
  data={selectedSubcategoria}
  type="Subcategoría"
  fields={subcategoriaFields}
  onSave={saveSubcategoria}
/>
        </div>
      </div>
      <div className="pagination mb-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    aria-disabled={currentPage === 1}
    className="btn btn-outline-primary"
  >
    ← Anterior
  </button>
  <span className="mx-2">{`Página ${currentPage} de ${lastPage}`}</span>
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === lastPage}
    aria-disabled={currentPage === lastPage}
    className="btn btn-outline-primary"
  >
    Siguiente →
  </button>
</div>
    </div>
 )}
 </>
);
};


export default FORM_Subcategoria;
