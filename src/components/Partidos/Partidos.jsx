import { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import "./index.css";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Cargando from "../Carga/carga";
import { API_ENDPOINT, IMAGES_URL } from '../../ConfigAPI';
import ErrorCarga from "../Error/Error";
const endpoint = API_ENDPOINT;
const Images = IMAGES_URL;

const Partidos = () => {
  const { subcategoriaId } = useParams();
  const [partidos, setPartidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars

  useEffect(() => {
    const getPartidos = async () => {
      try {
        // const response = await axios.get(`${endpoint}/partidos`);
        // const response = await axios.get(`${endpoint}/partidos/subcategoria/${subcategoriaId}`);
        // setPartidos(response.data);
        const partidosResponse = await axios.get(`${endpoint}subcategoria/${subcategoriaId}/partidos`);
        setPartidos(partidosResponse.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setError('error al cargar los partidos')
        console.error("Error al obtener los partidos:", error);
      }
    };

    getPartidos();
  }, [subcategoriaId]);

  useEffect(() => {
    document.title = "Partidos";
  }, []);

  return (
    <>
      <Menu />
      {isLoading ? (
          <div className="loading-container">
          <Cargando/>
            
          </div>
       
        ) :  error ? (
          <div className="loading-container">
             <ErrorCarga/>
          </div>
        )  : partidos.length > 0 ? (


          <><div className="col-sm-12 mt-4 hiden mb-5">
              <div className="card border-0 shadow">
                <div className="card-header fondo-card TITULO border-0">Partidos</div>
                <div className="card table-responsive border-0 table-sm">
                  <table className="table-borderless">
                    <thead>
                      <th></th>
                      <th className="titulo2 text-left">Local</th>
                      <th></th>
                      <th></th>
                      <th></th>
                      <th className="titulo2 text-right">Visitante</th>
                      <th></th>
                    </thead>
                    <tbody>
                      {partidos.map((partido) => (
                        <tr key={partido.id} width="10%">
                          <td width="10%">
                            <img
                              src={`${Images}/${partido.equipo_a.archivo}`}
                              className="logo" width="100%"
                              alt={partido.equipo_a.nombre} />
                          </td>

                          <td className="text-left team " width="40%">{partido.equipo_a.nombre}</td>
                          <td className=" data"> {partido.marcador1}</td>
                          <th className=" data">-</th>
                          <td className=" data"> {partido.marcador2}</td>
                          <td className="text-right team" width="40%">{partido.equipo_b.nombre}</td>
                          <td width="10%">
                            <img
                              src={`${Images}/${partido.equipo_b.archivo}`}
                              className="logo" width="100%"
                              alt={partido.equipo_b.nombre} />

                          </td>
                        </tr>





                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <section className="Partidos hiden-box">
                <div className="margen mt-4">
                  <div className="row">
                    {partidos.map((partido) => (
                      <div className="col-md-4 mb-4" key={partido.id}>
                        <div className="card card-matches d-flex justify-content-center align-items-center">
                          <div className="card-body d-flex justify-content-center align-items-center">
                            <div className="row">
                              <div className="col-4 d-flex justify-content-start align-items-center">
                                <img
                                  src={`${Images}/${partido.equipo_a.archivo}`}
                                  className="logo2 TeamLocal"
                                  alt={partido.equipo_a.nombre} />
                                <span className="team ">{partido.equipo_a.nombre}</span>
                                {/* <span className="team">{partido.equipoA.nombre}</span> */}
                              </div>
                              <div className="col-4 d-flex flex-wrap align-content-around justify-content-center">
                                <span className="score">{partido.marcador1} - {partido.marcador2}</span>
                              </div>
                              <div className="col-4 d-flex justify-content-end align-items-center">
                                <span className="team ">{partido.equipo_b.nombre}</span>
                                <img
                                  src={`${Images}/${partido.equipo_b.archivo}`} // Ruta de la imagen del equipo B
                                  className="logo2 TeamVisitante"
                                  alt={partido.equipo_b.nombre} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section></>
      
    ) : (
      <p className="no-datos">No hay Partidos disponibles en este momento.</p> // Mostrar este mensaje si no hay datos
    )}
      <Footer />
    </>
  );
};

export default Partidos;

// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { API_ENDPOINT } from '../../ConfigAPI';

// const Partidos = () => {
//   // eslint-disable-next-line no-unused-vars
//   const { categoriaId, subcategoriaId } = useParams();
//   const [partidos, setPartidos] = useState([]);

//   useEffect(() => {
//     const fetchPartidos = async () => {
//       try {
//         const response = await axios.get(`${endpoint}/partidos`);
//                 setPartidos(response.data);
//       } catch (error) {
//         console.error("Error al cargar los partidos:", error);
//       }
//     };

//     fetchPartidos();
//   }, [subcategoriaId]);

//   return (
//     <div>
//       <h2>Partidos de la Subcategoría {subcategoriaId}</h2>
//       <ul>
//         {partidos.map(partido => (
//           <li key={partido.id}>
//             {partido.equipo_local.nombre} vs {partido.equipo_visitante.nombre} - {partido.fecha}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Partidos;

