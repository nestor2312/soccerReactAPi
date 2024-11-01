/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

import { API_ENDPOINT } from '../../ConfigAPI';
import Cargando from "../Carga/carga";
import ErrorCarga from "../Error/Error";


const endpoint = `${API_ENDPOINT}torneo`;
const Infoendpoint = `${API_ENDPOINT}torneos`;
// eslint-disable-next-line no-unused-vars, react-hooks/rules-of-hooks

const FORM_Torneos = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [Nombre, setNombre] = useState("");
  const [error, setError] = useState(null);
  const [Torneos, setTorneos] = useState([]);
  

  // Manejo del envío del formulario
  const store = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("nombre", Nombre);

    try {
      await axios.post(endpoint, formData);
      // Actualizar la lista de torneos después de agregar un nuevo torneo
      InfoTorneos();
      setNombre("");
    } catch (error) {
      console.error("Error al guardar el torneo", error);
    } finally {
      setIsLoading(false); // Detén el estado de carga
    }
  
  };

 

  const deleteTorneo = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este torneo?')) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        setTorneos(Torneos.filter((Torneo) => Torneo.id !== id));
        // Mostrar un mensaje de éxito más amigable, por ejemplo, usando un toast o snackbar
      } catch (error) {
        console.error('Error al eliminar el torneo', error);
        // Mostrar un mensaje de error al usuario
      } finally {
        setIsLoading(false); // Asegúrate de establecerlo en false en ambos casos
      }
    }
  };

  // Función para obtener los torneos
  const InfoTorneos = async () => {
    try {
      const response = await axios.get(Infoendpoint);
      setTorneos(response.data);
      setIsLoading(false); // Detenemos el estado de carga al obtener los datos correctamente
    } catch (error) {
      setError("Error al cargar los Torneos.");
      console.error("Error al obtener los Torneos:", error);
      setIsLoading(false); // También lo detenemos si ocurre un error
    }
  };

  // useEffect para cargar los torneos solo una vez al montar el componente
  useEffect(() => {
    InfoTorneos();
    setIsLoading(true);
  }, []);

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
      <h1 className="text-left">Registro de Torneos</h1>
      <div>
        <form className="col-md-12" onSubmit={store}>
          {/* Nombre del torneo */}
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Torneo:</label>
            <input
              type="text"
              className="form-control form-input-admin"
              id="nombre"
              placeholder="Ingrese el nombre del torneo"
              value={Nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          {/* Botón para enviar el formulario */}
          <div className="d-flex mt-2 mb-2">
            <button className="btn btn-outline-primary" type="submit">
              Enviar
            </button>
          </div>
        </form>
      </div>

      {/* Tabla para mostrar los torneos */}
      <div>
        <div className="table-responsive card my-2">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th className="center">Torneo</th>
                <th className="center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Torneos.map((Torneo) => (
                <tr key={Torneo.id}>
                  <td className="center">{Torneo.nombre}</td>
                  <td className="center">
                    <button
                      className="btn btn-warning fas fa-pen"
                      onClick={() => alert('Implementar editar aquí')}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger far fa-trash-alt delete-btn"
                      onClick={() => deleteTorneo(Torneo.id)}
                    >
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default FORM_Torneos;
