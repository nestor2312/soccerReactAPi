import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import Inicio from './pages/Inicio';
import Partidos from './components/Partidos/Partidos';
import Equipos from './components/Equipos/Equipos';
import Jugadores from './components/Jugadores/Jugadores';
import Clasificacion from './components/Clasificacion';
import Registrar from './components/Registrar/Registrar';
import Bot from './pages/Immg';


function App() {

  return (
    <>
     <Router>
      <Routes>

      <Route path="/imgagenbot" element={<Bot />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/clasificacion" element={<Clasificacion />} />
        <Route path="/registrar" element={<Registrar />} />
        {/* <Route path="/torneo/:torneoId" element={<Torneo torneo={Torneodatos} />} />
        <Route path="/torneo/:torneoId/categoria/:categoriaId" element={<Categoria torneo={Torneodatos} />} />
        <Route path="/torneo/:torneoId/categoria/:categoriaId/subcategoria/:subcategoriaId/" element={<Subcategoria torneo={Torneodatos} />}>
        <Route path="inicio" element={<Inicio torneo={Torneodatos} />} />
          <Route path="grupos" element={<Grupos torneo={Torneodatos} />} />
          <Route path="equipos" element={<Equipos torneo={Torneodatos} />} />
          <Route path="partidos" element={<Partidos torneo={Torneodatos} />} />
          <Route path="jugadores" element={<Jugadores torneo={Torneodatos} />} />
          <Route path="clasificacion" element={<Clasificacion torneo={Torneodatos} />} />
          Agrega más subrutas según sea necesario
        </Route> */}
      </Routes>
    </Router>
   
    </>
  )
}

export default App
