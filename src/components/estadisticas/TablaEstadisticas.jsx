/* eslint-disable react/prop-types */
// TablaEstadisticas.js
import { IMAGES_URL } from "../../ConfigAPI";

const Images = IMAGES_URL;
const TablaEstadisticas = ({ titulo, campo, jugadores }) => (
    <section className=" Jugadores mt-2 mb-2">
      <div className="container-fluid">
        <div className="row ">
          <div className="mt-4">
            <div className="card border-0 shadow">
              <div className="card-header fondo-card TITULO border-0">
                {titulo}
              </div>
              <div className="card table-responsive border-0 table-sm">
                <table className="table-borderless">
                  <thead>
                    <tr>
                    <th></th>
                      <th className="text-left titulo2">Nombre</th>
                      <th className="text-center titulo2">{titulo}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jugadores.map((Player) => (
                      <tr key={Player.id}>
                        <td>
                        <img
                          src={`${Images}/${Player.equipo.archivo}`} 
                          className="logo"
                          alt={Player.equipo.nombre}
                        /> 
                        </td>
                         
                        <td>{Player.nombre} {Player.apellido}</td>
                        <td className="text-center">{Player[campo]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  
  export default TablaEstadisticas;
  