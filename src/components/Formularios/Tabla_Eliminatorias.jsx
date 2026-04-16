/* eslint-disable react/prop-types */
import React from "react";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const TablaEliminatoria = ({
  titulo,
  rondasKey, // "octavos", "cuartos", etc
  fasesData = {},
  eliminatorias = [],
  handleEditClick,
  deleteEliminatoria,
}) => {
  const hayIda = eliminatorias.some(p => p.marcador1_ida != null);
  const hayVuelta = eliminatorias.some(p => p.marcador1_vuelta != null);
  const hayPenales = eliminatorias.some(p => p.marcador1_penales != null);

  return (
    <div className="tab-pane fade scroll-container" id={`menu-${rondasKey}`}>
      <table className="table">
        <thead>
          <tr>
            <th className="text-center fondo-card-admin">{titulo}</th>
            {hayIda && <th className="text-center fondo-card-admin">Ida</th>}
            {hayVuelta && <th className="text-center fondo-card-admin">Vuelta</th>}
            {hayVuelta && <th className="text-center fondo-card-admin">Global</th>}
            {hayPenales && <th className="text-center fondo-card-admin">Penales</th>}
            <th className="text-center fondo-card-admin">Acciones</th>
          </tr>
        </thead>
<tbody>
        {Object.entries(fasesData).map(([nombreFase, rondas]) => {
            // PROTECCIÓN: Si la ronda no existe en esta fase, no hacemos nada
            const partidosDeEstaRonda = rondas[rondasKey] || [];

            return (
              <React.Fragment key={nombreFase}>
                {/* Solo mostramos el título de la copa si tiene partidos con ID */}
                {partidosDeEstaRonda.some(p => p.id) && (
                  <tr className="table-dark">
                    <td colSpan="10" className="text-center fw-bold py-2">
                      --- {nombreFase.toUpperCase()} ---
                    </td>
                  </tr>
                )}

                {partidosDeEstaRonda.map((partido) => {
                  if (!partido.id) return null;

                  const m1g = partido.marcador1_vuelta != null
                    ? (Number(partido.marcador1_ida) || 0) + (Number(partido.marcador1_vuelta) || 0)
                    : null;

                  const m2g = partido.marcador2_vuelta != null
                    ? (Number(partido.marcador2_ida) || 0) + (Number(partido.marcador2_vuelta) || 0)
                    : null;

                  return (
                    <tr key={partido.id} className="fondo-card-admin">
                      <td className="text-center">
                        {partido.equipo_aa?.nombre || "Por Definir"} 
                        <strong> VS </strong>
                        {partido.equipo_b?.nombre || "Por Definir"}
                      </td>

                      {hayIda && (
                        <td className="text-center">
                          {partido.marcador1_ida ?? "-"} - {partido.marcador2_ida ?? "-"}
                        </td>
                      )}

                      {hayVuelta && (
                        <td className="text-center">
                          {partido.marcador1_vuelta ?? "-"} - {partido.marcador2_vuelta ?? "-"}
                        </td>
                      )}

                      {hayVuelta && (
                        <td className="text-center">
                          {m1g != null ? `${m1g} - ${m2g}` : "-"}
                        </td>
                      )}

                      {hayPenales && (
                        <td className="text-center">
                          {partido.marcador1_penales ?? "-"} - {partido.marcador2_penales ?? "-"}
                        </td>
                      )}

                      <td className="text-center d-flex justify-content-evenly">
                        <button className="btn btn-warning" onClick={() => handleEditClick(partido)}>
                          <CreateIcon />
                        </button>

                        <button className="btn btn-danger ms-3" onClick={() => deleteEliminatoria(partido.id)}>
                          <DeleteOutlineIcon />
                        </button>
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