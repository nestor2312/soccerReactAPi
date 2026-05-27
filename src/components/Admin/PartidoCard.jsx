/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// eslint-disable-next-line react-refresh/only-export-components
import "./esilosElin.css";
const PartidoCard = ({ partido, Images, gapInterno ,ErrorLogo, abreviarNombre, eliminatoriasOctavos }) => {
  const {
    marcador1_ida,
    marcador1_vuelta,
    marcador2_ida,
    marcador2_vuelta,
    marcador1_penales,
    marcador2_penales,
    equipo_aa,
    equipo_b
  } = partido;

  // Cálculos globales limpios
  const marcador1_global = marcador1_vuelta ? marcador1_ida + marcador1_vuelta : marcador1_ida;
  const marcador2_global = marcador2_vuelta ? marcador2_ida + marcador2_vuelta : marcador2_ida;

  const isLocalWinner =
    marcador1_global > marcador2_global ||
    (marcador1_global === marcador2_global && marcador1_penales > marcador2_penales);

  const isVisitanteWinner =
    marcador2_global > marcador1_global ||
    (marcador2_global === marcador1_global && marcador2_penales > marcador1_penales);

  // Manejador de error para las imágenes
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = ErrorLogo;
    e.target.classList.add("error-logoElim");
  };

  

  // Renderizado de cada fila de equipo (Local / Visitante)
  const renderEquipo = (equipo, marcadorIda, marcadorVuelta, marcadorGlobal, marcadorPenales, isWinner, isLoser) => {
    const estadoClass = isWinner ? "win" : isLoser ? "lose" : "";
    
    return (
      <div className={`jugador ${estadoClass}`}>
        <img
          src={`${Images}/${equipo?.archivo}`}
          alt=""
          className="logo"
          onError={handleImgError}
        />
        <span className="equipo">
          {equipo ? abreviarNombre(equipo.nombre) : "Por Definir"}
        </span>
        <span className="goles">
          {marcadorIda} {marcadorVuelta || " "}
          {marcadorVuelta && ` (${marcadorGlobal})`}
          {marcadorPenales !== undefined && marcadorPenales !== null ? ` (${marcadorPenales})` : ""}
        </span>
      </div>
    );
  };

return (
  <div className="partido" style={{  borderRadius: "8px", }}>
    <div  
      className="jornada"
      style={{ 
        gap: `${gapInterno}px`, // Estira la distancia entre el local y visitante de forma exponencial
     
      
      }}
    >
      {renderEquipo(equipo_aa, marcador1_ida, marcador1_vuelta, marcador1_global, marcador1_penales, isLocalWinner, isVisitanteWinner)}
      {renderEquipo(equipo_b, marcador2_ida, marcador2_vuelta, marcador2_global, marcador2_penales, isVisitanteWinner, isLocalWinner)}
    </div>
  </div>
);
};

export default PartidoCard;