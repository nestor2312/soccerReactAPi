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
    final: "Final",
  };

  const estructuraFases = [
    { id: "dieciseisavos", datos: rondas?.dieciseisavos },
    { id: "octavos", datos: rondas?.octavos },
    { id: "cuartos", datos: rondas?.cuartos },
    { id: "semis", datos: rondas?.semis },
    { id: "final", datos: rondas?.final },
  ];

  const fasesActivas = estructuraFases.filter(
    (fase) => fase.datos && fase.datos.length > 0
  );

  const primeraFase = fasesActivas[0]?.id;

  // DETECCIÓN DE PLAY_IN
  const tienePlayIn = fasesActivas.some((fase) =>
    fase.datos?.some((partido) => partido?.tipo_partido_extra === "play_in")
  );

  const modoTorneo = tienePlayIn ? "playin" : "normal";
  const torneoTipoKey = `${primeraFase}_${modoTorneo}`;

  // CAMPEÓN
  const partidoFinal = rondas?.final?.[0];
  let campeon = null;

  if (partidoFinal) {
    const m1 = Number(partidoFinal.marcador1_ida) || 0;
    const m2 = Number(partidoFinal.marcador2_ida) || 0;

    const m1_v =
      partidoFinal.marcador1_vuelta !== null &&
      partidoFinal.marcador1_vuelta !== undefined
        ? Number(partidoFinal.marcador1_vuelta)
        : null;

    const m2_v =
      partidoFinal.marcador2_vuelta !== null &&
      partidoFinal.marcador2_vuelta !== undefined
        ? Number(partidoFinal.marcador2_vuelta)
        : null;

    const g1 = m1_v !== null ? m1 + m1_v : m1;
    const g2 = m2_v !== null ? m2 + m2_v : m2;

    const jugado =
      partidoFinal.marcador1_ida !== null &&
      partidoFinal.marcador2_ida !== null;

    if (jugado) {
      if (g1 > g2) campeon = partidoFinal.equipo_aa;
      else if (g2 > g1) campeon = partidoFinal.equipo_b;
      else if (
        partidoFinal.marcador1_penales !== null &&
        partidoFinal.marcador2_penales !== null
      ) {
        campeon =
          Number(partidoFinal.marcador1_penales) >
          Number(partidoFinal.marcador2_penales)
            ? partidoFinal.equipo_aa
            : partidoFinal.equipo_b;
      }
    }
  }

  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = ErrorLogo;
    e.target.classList.add("error-logoElim");
  };

  // 🎛️ MATRIZ DE CONFIGURACIÓN
  const matrizConfiguracion = {
    semis: {
      normal: {
        semis: { gapPartidos: 15, gapInterno: 20, alturaConector: 55 },
        final: { gapPartidos: 100, gapInterno: 85, alturaConector: 120 },
      },
      playin: {
        semis: { gapPartidos: 1, gapInterno: 15, alturaConector: 55 },
        final: { gapPartidos: 100, gapInterno: 25, alturaConector: 70 },
      },
    },
    cuartos: {
      normal: {
        cuartos: { gapPartidos: 15, gapInterno: 20, alturaConector: 60 },
        semis: { gapPartidos: 0, gapInterno: 85, alturaConector: 125 },
        final: { gapPartidos: 110, gapInterno: 220, alturaConector: 260 },
      },
      playin: {
        cuartos: { gapPartidos: 0, gapInterno: 15, alturaConector: 50 },
        semis: { gapPartidos: 0, gapInterno: 35, alturaConector: 70 },
        final: { gapPartidos: 40, gapInterno:85, alturaConector: 125 },
      },
    },
    octavos: {
      normal: {
        octavos: { gapPartidos: 1, gapInterno: 10, alturaConector: 45 },
        cuartos: { gapPartidos: 0, gapInterno: 85, alturaConector: 125 },
        semis: { gapPartidos: 5, gapInterno: 200, alturaConector: 245 },
        final: { gapPartidos: 205, gapInterno: 440, alturaConector: 480 },
      },
      playin: {
        octavos: { gapPartidos: 0, gapInterno: 20, alturaConector: 55 },
        cuartos: { gapPartidos: 0, gapInterno: 35, alturaConector: 70 },
        semis: { gapPartidos: 10, gapInterno: 80, alturaConector: 125 },
        final: { gapPartidos: 205, gapInterno: 210, alturaConector: 250 },
      },
    },
    dieciseisavos: {
      normal: {
        dieciseisavos: { gapPartidos: 1, gapInterno: 20, alturaConector: 55 },
        octavos: { gapPartidos: 1, gapInterno: 80, alturaConector: 125 },
        cuartos: { gapPartidos: 1, gapInterno: 210, alturaConector: 245 },
        semis: { gapPartidos: 1, gapInterno: 440, alturaConector: 485 },
        final: { gapPartidos: 1, gapInterno: 925, alturaConector: 960 },
      },
      playin: {
        dieciseisavos: { gapPartidos: 0, gapInterno: 10, alturaConector: 50 },
        octavos: { gapPartidos: 0, gapInterno: 30, alturaConector: 75 },
        cuartos: { gapPartidos: 1, gapInterno: 85, alturaConector: 125 },
        semis: { gapPartidos: 1, gapInterno: 200, alturaConector: 240 },
        final: { gapPartidos: 1, gapInterno: 445, alturaConector: 480 },
      },
    },
    final: {
      normal: {
        final: { gapPartidos: 20, gapInterno: 25, alturaConector: 60 },
      },
      playin: {
        final: { gapPartidos: 25, gapInterno: 30, alturaConector: 70 },
      },
    },
  };

  return (
    <div className="wrapper card">
      {/* TÍTULOS */}
      <div className="titulos mb-4">
        {fasesActivas.map((fase) => {
          const esPlayInFase = fase.datos?.some(
            (p) => p?.tipo_partido_extra === "play_in"
          );

          let titulo = nombresFases[fase.id];

          if (esPlayInFase) {
            titulo = "Repechaje";
          }

          return (
            <div key={fase.id} className="titulo ">
              {titulo}
            </div>
          );
        })}

        {rondas?.final?.length > 0 && (
          <div className="titulo">Campeón</div>
        )}
      </div>

      {/* ESQUEMA */}
      <div className={`esquema torneo-${torneoTipoKey}`}>
        {fasesActivas.map((fase, index) => {
          const configActual =
            matrizConfiguracion[primeraFase]?.[modoTorneo]?.[fase.id] ||
            matrizConfiguracion[primeraFase]?.normal?.[fase.id] || {
              gapPartidos: 20,
              gapInterno: 40,
              alturaConector: 100,
            };

          const { gapPartidos, gapInterno, alturaConector } = configActual;

          const esFinal = fase.id === "final";
          const tieneSiguiente =
            index < fasesActivas.length - 1 ||
            (esFinal && rondas?.final?.length > 0);

          const esPlayInFase = fase.datos?.some(
            (p) => p?.tipo_partido_extra === "play_in"
          );

          return (
            <React.Fragment key={fase.id}>
              {/* PARTIDOS */}
              <div
                className={`jornada_contenedor ${
                  esPlayInFase ? "playin-col" : ""
                }`}
                style={{
                  gap: `${gapPartidos}px`,
                }}
              >
                {fase.datos.map((partido, i) => (
                  <PartidoCard
                    key={`${fase.id}-${partido.id || i}`}
                    partido={partido}
                    Images={Images}
                    ErrorLogo={ErrorLogo}
                    abreviarNombre={abreviarNombre}
                    gapInterno={gapInterno}
                  />
                ))}
              </div>

              {/* CONECTORES */}
              {tieneSiguiente &&
                (esPlayInFase ? (
                  <div className="playin-conector">
                    <ConectoresFase
                      cantidad={esFinal ? 1 : fase.datos.length}
                      tieneSiguiente={true}
                      altura={alturaConector}
                      esFaseFinal={esFinal}
                    />
                  </div>
                ) : (
                  <ConectoresFase
                    cantidad={esFinal ? 1 : fase.datos.length}
                    tieneSiguiente={true}
                    altura={alturaConector}
                    esFaseFinal={esFinal}
                  />
                ))}
            </React.Fragment>
          );
        })}

        {/* CAMPEÓN */}
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
                  <span className="equipo">{campeon.nombre}</span>
                  <span className="badge_campeon">🏆</span>
                </div>
              ) : (
                <div className="jugador por-definir">
                  <span>Por Definir 🏆</span>
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