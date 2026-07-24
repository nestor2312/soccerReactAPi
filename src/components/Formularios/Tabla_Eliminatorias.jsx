/* eslint-disable react/prop-types */
import React from "react";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

const TablaEliminatoria = ({
  titulo,
  rondasKey,
  fasesData = {},
  handleEditClick,
  deleteEliminatoria,
  handleEventsClick, // Prop nueva
}) => {
  return (
    <div className="tab-pane fade show active scroll-container" id={`menu-${rondasKey}`}>
      <table className="table align-middle">
        <thead>
          <tr>
            <th className="text-center fondo-card-admin">{titulo}</th>
            <th className="text-center fondo-card-admin">Ida</th>
            <th className="text-center fondo-card-admin">Vuelta</th>
            <th className="text-center fondo-card-admin">Penales</th>
                 <th className="text-center fondo-card-admin">Fecha</th>
                      <th className="text-center fondo-card-admin">Hora</th>
                           <th className="text-center fondo-card-admin">Sede</th>
            <th className="text-center fondo-card-admin">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(fasesData).map(([nombreFase, rondas]) => {
            const partidosDeEstaRonda = rondas[rondasKey] || [];
            if (partidosDeEstaRonda.length === 0) return null;

            return (
              <React.Fragment key={nombreFase}>
                <tr className="table-dark">
                  <td colSpan="8" className="text-center fw-bold py-2 small">
                    --- {nombreFase.toUpperCase()} ---
                  </td>
                </tr>

                {partidosDeEstaRonda.map((partido) => {
                  if (!partido.id) return null;

                  return (
                    <tr key={partido.id} className="fondo-card-admin">
                      <td className="text-center py-3">
                        <span className="fw-bold">{partido.equipo_aa?.nombre || "Por definir"}</span>
                        <span className="text-muted mx-2">vs</span>
                        <span className="fw-bold">{partido.equipo_b?.nombre || "Por definir"}</span>
                      </td>

                      {/* IDA */}
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {partido.marcador1_ida ?? "-"} - {partido.marcador2_ida ?? "-"}
                          <button className="btn btn-sm text-primary p-0" onClick={() => handleEventsClick(partido, 'ida')}>
                            <SportsSoccerIcon style={{ fontSize: '1rem' }} />
                          </button>
                        </div>
                      </td>

                      {/* VUELTA */}
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {partido.marcador1_vuelta ?? "-"} - {partido.marcador2_vuelta ?? "-"}
                          {partido.marcador1_vuelta !== null && (
                            <button className="btn btn-sm text-info p-0" onClick={() => handleEventsClick(partido, 'vuelta')}>
                              <SportsSoccerIcon style={{ fontSize: '1rem' }} />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* PENALES */}
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {partido.marcador1_penales ?? "-"} - {partido.marcador2_penales ?? "-"}
                          {partido.marcador1_penales !== null && (
                            <button className="btn btn-sm text-dark p-0" onClick={() => handleEventsClick(partido, 'tanda_penales')}>
                              🥅
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {partido.fecha ?? "por definir"} 
                         
                        </div>
                      </td>
                            <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {partido.hora ?? "por definir"} 
                         
                        </div>
                      </td>      <td className="text-center">
                        <div className="d-flex flex-column align-items-center">
                          {partido.sede ?? "por definir"} 
                         
                        </div>
                      </td>

                      <td className="text-center">
                        <div className="btn-group">
                          <button className="btn btn-sm btn-warning" onClick={() => handleEditClick(partido)}>
                            <CreateIcon fontSize="small" />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => deleteEliminatoria(partido.id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEliminatoria;