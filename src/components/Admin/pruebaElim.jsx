/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React from "react";
import PartidoCard from "./PartidoCard";
import ConectoresFase from "./ConectoresFase";
import "./esilosElin.css";

const PruebaElim = ({ rondas, Images, ErrorLogo, abreviarNombre }) => {
  
   const nombresFases = {
    dieciseisavos: "Dieciseisavos",
    octavos: "Octavos",
    cuartos: "Cuartos",
    semis: "Semis",
    final: "Final"
  };

  const estructuraFases = [
     { id: "dieciseisavos", datos: rondas?.dieciseisavos  },
    { id: "octavos", datos: rondas?.octavos },
    { id: "cuartos", datos: rondas?.cuartos },
    { id: "semis", datos: rondas?.semis },
    { id: "final", datos: rondas?.final }
  ];

  const fasesActivas = estructuraFases.filter(fase => fase.datos && fase.datos.length > 0);

const torneoTipo = fasesActivas[0]?.id;

  // OBTENER AL CAMPEÓN: Miramos si la fase final ya tiene un partido jugado y un ganador
  const partidoFinal = rondas?.final?.[0];
  let campeon = null;

  if (partidoFinal) {
    const m1 = Number(partidoFinal.marcador1_ida) || 0;
    const m2 = Number(partidoFinal.marcador2_ida) || 0;
    const m1_v = partidoFinal.marcador1_vuelta !== null ? Number(partidoFinal.marcador1_vuelta) : null;
    const m2_v = partidoFinal.marcador2_vuelta !== null ? Number(partidoFinal.marcador2_vuelta) : null;
    const g1 = m1_v !== null ? m1 + m1_v : m1;
    const g2 = m2_v !== null ? m2 + m2_v : m2;

    const jugado = partidoFinal.marcador1_ida !== null && partidoFinal.marcador2_ida !== null;

    if (jugado) {
      if (g1 > g2) campeon = partidoFinal.equipo_aa;
      else if (g2 > g1) campeon = partidoFinal.equipo_b;
      else if (partidoFinal.marcador1_penales !== null && partidoFinal.marcador2_penales !== null) {
        if (Number(partidoFinal.marcador1_penales) > Number(partidoFinal.marcador2_penales)) campeon = partidoFinal.equipo_aa;
        if (Number(partidoFinal.marcador2_penales) > Number(partidoFinal.marcador1_penales)) campeon = partidoFinal.equipo_b;
      }
    }
  }

  // Manejador de error para la imagen del campeón
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = ErrorLogo;
    e.target.classList.add("error-logoElim");
  };

  return (
 <div className="wrapper">
<div className="titulos">
        {fasesActivas.map((fase) => (
          <div key={fase.id} className="titulo">
            {nombresFases[fase.id]}
          </div>
        ))}
        {rondas.final?.length > 0 && (
          <div className="titulo">Campeón</div>
        )}
      </div>

  <div className={`esquema torneo-${torneoTipo}`}>
{fasesActivas.map((fase, index) => {
  
  // 🚩 Identificamos en qué tipo de torneo estamos según su ronda inicial
  // Puede ser: "dieciseisavos", "octavos", "cuartos", "semis" o "final"
  const torneoTipo = fasesActivas[0]?.id;

  // 🎛️ TU MATRIZ DE CONTROL ABSOLUTO:
  // Aquí diseñas de forma independiente cada tipo de árbol.
  const matrizConfiguracion = {
    // 1. SI EL TORNEO EMPIEZA DIRECTO EN SEMIFINALES
    semis: {
      semis: { gapPartidos: 15, gapInterno: 20, alturaConector: 55 },
      final: { gapPartidos: 100, gapInterno: 85, alturaConector: 120 }
    },

    // 2. SI EL TORNEO EMPIEZA DESDE CUARTOS DE FINAL
    cuartos: {
      cuartos: { gapPartidos: 15, gapInterno: 20, alturaConector: 60 },
      semis:   { gapPartidos: 0, gapInterno: 85, alturaConector: 125 }, // ← Lo modificas sin romper el torneo de arriba
      final:   { gapPartidos: 110, gapInterno: 220, alturaConector: 260 }  // ← Lo modificas sin romper el torneo de arriba
    },

    // 3. SI EL TORNEO EMPIEZA DESDE OCTAVOS DE FINAL
    octavos: {
      octavos: { gapPartidos: 1, gapInterno: 10, alturaConector: 45 },
      cuartos: { gapPartidos: 0, gapInterno: 85, alturaConector: 125 },
      semis:   { gapPartidos: 5, gapInterno: 200, alturaConector: 245 },
      final:   { gapPartidos: 205, gapInterno: 440, alturaConector: 480 }
    },

    // 4. SI EL TORNEO ES GIGANTE Y EMPIEZA EN DIECISEISAVOS
    dieciseisavos: {
      dieciseisavos: { gapPartidos: 1, gapInterno: 20, alturaConector: 55 },
      octavos:       { gapPartidos: 1, gapInterno: 80, alturaConector: 125 },
      cuartos:       { gapPartidos: 1, gapInterno: 210, alturaConector:245 },
      semis:         { gapPartidos: 1, gapInterno: 440, alturaConector: 485 },
      final:         { gapPartidos: 1, gapInterno: 925, alturaConector: 960 }
    },

    // 5. CASO BORDE: SOLO SE JUEGA LA FINAL DIRECTA
    final: {
      final: { gapPartidos: 20, gapInterno: 25, alturaConector: 60 }
    }
  };

  // Buscamos la configuración específica para la fase actual dentro del tipo de torneo correcto
  const configActual = matrizConfiguracion[torneoTipo]?.[fase.id] || { 
    gapPartidos: 20, 
    gapInterno: 40, 
    alturaConector: 100 
  };

  

  // Extraemos las variables calibradas por ti
  const gapPartidos = configActual.gapPartidos;
  const gapInterno = configActual.gapInterno;
  const alturaConector = configActual.alturaConector;
  
  const esFinal = fase.id === "final";
  const tieneSiguiente = index < fasesActivas.length - 1 || esFinal;

  return (
    <React.Fragment key={fase.id}>
    
      {/* 🔵 COLUMNA DE PARTIDOS */}
      <div className="jornada_contenedor" style={{ gap: `${gapPartidos}px` }}>
        {fase.datos.map((partido, i) => (
          <PartidoCard
            key={`${fase.id}-${i}`}
            partido={partido}
            Images={Images}
            ErrorLogo={ErrorLogo}
            abreviarNombre={abreviarNombre}
            gapInterno={gapInterno}
          />
        ))} 
      </div>

      {/* 🔗 COLUMNA DE CONECTORES */}
      {tieneSiguiente && (
        <ConectoresFase
          cantidad={esFinal ? 1 : fase.datos.length}
          tieneSiguiente={true}
          altura={alturaConector} 
          esFaseFinal={esFinal}
        />
      )}
    </React.Fragment>
  );
})}

      {/* 🏆 COLUMNA DEL CAMPEÓN (Solo si la fase final existe en el árbol) */}
      {rondas?.final?.length > 0 && (
        <div className="jornada_contenedor campeon_columna">
          <div className="campeon_box">
            {campeon ? (
              <div className="jugador win">
                <img 
                  src={`${Images}/${campeon?.archivo}`} 
                  alt="" 
                  className="logo" 
                  onError={handleImgError}
                />
                <span className="equipo">{abreviarNombre(campeon.nombre)}</span>
                <span className="badge_campeon">🏆</span>
              </div>
            ) : (
              <div className="jugador por-definir">
                <span className="equipo">Por Definir 🏆</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
 </div>


  );
};

export default PruebaElim;