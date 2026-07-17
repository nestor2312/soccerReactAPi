import axios from "axios";
import Footer from "../Footer/Footer";
import Menu from "../Menu/Menu";
import { useEffect, useState } from "react";
import Cargando from "../Carga/carga";
import { API_ENDPOINT } from "../../ConfigAPI";
import ErrorCarga from "../Error/Error";
import { useParams } from "react-router-dom";
import TablaEstadisticas, { TablaEquipos } from "../estadisticas/TablaEstadisticas";

const endpoint = API_ENDPOINT;

const Estadisticas = () => {
  const { subcategoriaId } = useParams();

  const [jugadores, setJugadores] = useState({
    rojas: [],
    amarillas: [],
    goles: [],
    asistencias: [],
  });

  const [equiposDefensa, setEquiposDefensa] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // CALCULAR VALLA MENOS VENCIDA
 const calcularVallaMenosVencida = (partidos) => {
  const equipos = {};

  partidos.forEach((p) => {

    // 🔥 Soporta ambos tipos de partido
    const equipoA = p.equipo_aa || p.equipo_a;
    const equipoB = p.equipo_b;

    const idA = equipoA?.id;
    const idB = equipoB?.id;

    if (!idA || !idB) return;

    if (!equipos[idA]) {
      equipos[idA] = {
        equipo: equipoA,
        golesRecibidos: 0,
      };
    }

    if (!equipos[idB]) {
      equipos[idB] = {
        equipo: equipoB,
        golesRecibidos: 0,
      };
    }

    // 🔥 Detectar tipo de marcador
    const golesA =
      p.marcador1 ??
      ((p.marcador1_ida ?? 0) + (p.marcador1_vuelta ?? 0));

    const golesB =
      p.marcador2 ??
      ((p.marcador2_ida ?? 0) + (p.marcador2_vuelta ?? 0));

    // 🔥 Sumar goles recibidos
    equipos[idA].golesRecibidos += golesB;
    equipos[idB].golesRecibidos += golesA;
  });

  return Object.values(equipos)
    .sort((a, b) => a.golesRecibidos - b.golesRecibidos)
    .slice(0, 5);
};

  useEffect(() => {
    const getDatos = async () => {
      try {
        // 🔹 jugadores
        const resJugadores = await axios.get(
          `${endpoint}subcategoria/${subcategoriaId}/jugadores`
        );

        // 🔹 partidos normales
        const resPartidos = await axios.get(
          `${endpoint}subcategoria/${subcategoriaId}/partidos`
        );

        // 🔹 eliminatorias
        const resElim = await axios.get(
          `${endpoint}eliminatoria/subcategoria/${subcategoriaId}`
        );

        const eliminatorias = Object.values(resElim.data).flatMap((f) => [
          ...(f.dieciseisavos || []),
          ...(f.octavos || []),
          ...(f.cuartos || []),
          ...(f.semis || []),
          ...(f.final || []),
          ...(f.tercer_puesto || []),
        ]);

        const todosPartidos = [...resPartidos.data, ...eliminatorias];

        // 🔥 DEFENSA
        const mejoresDefensas = calcularVallaMenosVencida(todosPartidos);
        setEquiposDefensa(mejoresDefensas);

        // 🔥 JUGADORES
        setJugadores({
          rojas: [...resJugadores.data]
            .sort((a, b) => b.card_roja - a.card_roja)
            .slice(0, 5),

          amarillas: [...resJugadores.data]
            .sort((a, b) => b.card_amarilla - a.card_amarilla)
            .slice(0, 5),

          goles: [...resJugadores.data]
            .sort((a, b) => b.goles - a.goles)
            .slice(0, 5),

          asistencias: [...resJugadores.data]
            .sort((a, b) => b.asistencias - a.asistencias)
            .slice(0, 5),
        });

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError("Error al cargar estadísticas");
        setIsLoading(false);
      }
    };

    getDatos();
  }, [subcategoriaId]);

  return (
    <div className="layout">
      <Menu />

      {isLoading ? (
        <div className="loading-container">
          <Cargando />
        </div>
      ) : error ? (
        <div className="loading-container">
          <ErrorCarga />
        </div>
      ) : (
        <main className="main-content">
          <section>
            <div className="margen">
              <div className="row">

                <div className="col-12 col-md-6">
                  <TablaEstadisticas titulo="Goles" campo="goles" jugadores={jugadores.goles} />
                </div>

                <div className="col-12 col-md-6">
                  <TablaEstadisticas titulo="Asistencias" campo="asistencias" jugadores={jugadores.asistencias} />
                </div>

                <div className="col-12 col-md-6">
                  <TablaEstadisticas titulo="Tarjetas Rojas" campo="card_roja" jugadores={jugadores.rojas} />
                </div>

                <div className="col-12 col-md-6">
                  <TablaEstadisticas titulo="Tarjetas Amarillas" campo="card_amarilla" jugadores={jugadores.amarillas} />
                </div>

                {/* NUEVA ESTADÍSTICA */}
                <div className="col-12 col-md-6">
                  <TablaEquipos
                    titulo="Valla Menos Vencida"
                    equipos={equiposDefensa}
                  />
                </div>

              </div>
            </div>
          </section>
        </main>
      )}

      {!isLoading && !error && <Footer />}
    </div>
  );
};

export default Estadisticas;