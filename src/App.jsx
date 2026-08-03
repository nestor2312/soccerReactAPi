/* eslint-disable react/prop-types */
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

// import Inicio from "./pages/Inicio";
// import Partidos from "./components/Partidos/Partidos";
// import Equipos from "./components/Equipos/Equipos";
// import Jugadores from "./components/Jugadores/Jugadores";
// import Clasificacion from "./components/Clasificacion";
// import Registrar from "./components/Registrar/Registrar";
// import Bot from "./pages/Immg";
// import Torneo from "./components/Torneo/Torneo";
// import Categoria from "./components/Categoria/Categoria";
// import Subcategoria from "./components/Subcategoria/Subcategoria";
// import Login from "./components/Login/Login";
// import ProtectedRoute from "./components/ProtectedRoute"; // Importar el ProtectedRoute

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/imgagenbot" element={<Bot />} />
//         <Route path="/" element={<Inicio />} />
//         <Route path="/partidos" element={<Partidos />} />
//         <Route path="/equipos" element={<Equipos />} />
//         <Route path="/jugadores" element={<Jugadores />} />
//         <Route path="/clasificacion" element={<Clasificacion />} />

//         <Route path="/torneo" element={<Torneo />} />
//         <Route path="/torneo/:id/categorias" element={<Categoria />} />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria"
//           element={<Subcategoria />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/equipos"
//           element={<Equipos />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/jugadores"
//           element={<Jugadores />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/inicio"
//           element={<Inicio />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/partidos"
//           element={<Partidos />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/clasificacion"
//           element={<Clasificacion />}
//         />

//         <Route path="/login" element={<Login />} />
//         {/* <Route path="/registrar" element={<Registrar />} /> */}
//         {/* Rutas protegidas */}

//                 <Route path="/registrar" element={
//                    <ProtectedRoute>
//  <Registrar />
//                    </ProtectedRoute>
//                  } />
// {/*
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/inicio"
//           element={
//             <ProtectedRoute>
//               <Inicio />
//             </ProtectedRoute>
//           }
//         /> */}

//         {/* Puedes agregar más rutas protegidas como esta */}
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, useLocation  } from "react-router-dom";

import Login from "./components/Login/Login";
import Inicio from "./pages/Inicio";
import ProtectedRoute from "./components/ProtectedRoute";
import Partidos from "./components/Partidos/Partidos";
import Equipos from "./components/Equipos/Equipos";
import Jugadores from "./components/Jugadores/Jugadores";
import Clasificacion from "./components/Clasificacion";
import Estadisticas from "./components/estadisticas/Estadisticas";

// import Registrar from "./components/Registrar/Registrar";
import Torneo from "./components/Torneo/Torneo";
import Categoria from "./components/Categoria/Categoria";
import Subcategoria from "./components/Subcategoria/Subcategoria";
import Register from "./components/Login/Registrar";

import { useEffect, useState } from "react";
import Admin from "./pages/Admin";
import LogoutButton from "./components/Login/CerrarSesion";
import JugadorShow from "./components/Jugadores/JugadoresShow";
import JugadorShowTeam from "./components/Jugadores/JugadoresShowTeam";
import JugadoresEquipo from "./components/Jugadores/JugadoresEquipo";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";


const RoutesWithAnalytics = ({ setIsAuthenticated }) => {
  const location = useLocation();

  const [theme, setTheme] = useState("dark");

const themes = ["oscuro", "azul", "defecto"];

const changeTheme = () => {
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  setTheme(themes[nextIndex]);
};

useEffect(() => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme && themes.includes(savedTheme)) {
    setTheme(savedTheme);
  }
}, []);

useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]);

// const isLanding = location.pathname === "/login";

// {!isLanding && (
//   <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
//     {theme === "light" ? "🌙" : "☀️"}
//   </button>
// )}


  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

 return (
  <div >
    
   
 {/* Se ubica al final del JSX principal, fuera del flujo normal */}
<button onClick={changeTheme} className="theme-toggle-floating">
  🎨 {theme}
</button>
    <Routes>
      <Route path="landing" element={<Landing />} />
      <Route path="/" element={<Torneo />} />
      <Route path="/torneo/:id/categorias" element={<Categoria />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria" element={<Subcategoria />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/equipos" element={<Equipos />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/jugadores" element={<Jugadores />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/jugadores/:jugadorId" element={<JugadorShow />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/inicio" element={<Inicio />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/partidos" element={<Partidos />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/clasificacion" element={<Clasificacion />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/estadisticas" element={<Estadisticas />} />
      <Route path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/jugadoresteam/:jugadorId" element={<JugadorShowTeam />} />
      <Route path="/torneo/categoria/:subcategoriaId/equipo/:equipoId/jugadores" element={<JugadoresEquipo />} />
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<LogoutButton setIsAuthenticated={setIsAuthenticated} />} />
      <Route
        path="/registrar_datos"
        element={
          <ProtectedRoute>
            <Admin setIsAuthenticated={setIsAuthenticated} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>

  </div>
);
};

function App() {
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <RoutesWithAnalytics setIsAuthenticated={setIsAuthenticated} />
    </BrowserRouter>
  );
}

export default App;




// // import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";

// import Inicio from "./pages/Inicio";
// import Partidos from "./components/Partidos/Partidos";
// import Equipos from "./components/Equipos/Equipos";
// import Jugadores from "./components/Jugadores/Jugadores";
// import Clasificacion from "./components/Clasificacion";
// import Registrar from "./components/Registrar/Registrar";
// import Bot from "./pages/Immg";
// import Torneo from "./components/Torneo/Torneo";
// import Categoria from "./components/Categoria/Categoria";
// import Subcategoria from "./components/Subcategoria/Subcategoria";
// import Login from "./components/Login/Login";

// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import Bot from "./pages/Immg";
// // import Login from "./components/Login/Login";
// // import Register from "./components/Login/Registrar";
// // import Inicio from "./pages/Inicio";
// import ProtectedRoute from './components/ProtectedRoute';
// import { useEffect, useState } from 'react';

// // import ProtectedRoute from "./components/ProtectedRoute"; // Importar el ProtectedRoute

// function App() {
//  // eslint-disable-next-line no-unused-vars
//  const [isAuthenticated, setIsAuthenticated] = useState(false);

//  useEffect(() => {
//    const token = sessionStorage.getItem('token');
//    if (token) {
//      setIsAuthenticated(true);  // Marcar como autenticado si existe el token
//    }
//  }, []);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/imgagenbot" element={<Bot />} />
//         <Route path="/" element={<Inicio />} />
//         <Route path="/partidos" element={<Partidos />} />
//         <Route path="/equipos" element={<Equipos />} />
//         <Route path="/jugadores" element={<Jugadores />} />
//         <Route path="/clasificacion" element={<Clasificacion />} />
//         <Route path="/torneo" element={<Torneo />} />
//         <Route path="/torneo/:id/categorias" element={<Categoria />} />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria"
//           element={<Subcategoria />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/equipos"
//           element={<Equipos />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/jugadores"
//           element={<Jugadores />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/inicio"
//           element={<Inicio />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/partidos"
//           element={<Partidos />}
//         />
//         <Route
//           path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/clasificacion"
//           element={<Clasificacion />}
//         />

// <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
//         <Route path="/registrar" element={<Registrar />} />
//         {/* Rutas protegidas */}

//         <Route
//           path="/profile"
//           element={
//             <ProtectedRoute>
//               <Inicio />
//             </ProtectedRoute>
//           }
//         />

//         {/* Puedes agregar más rutas protegidas como esta */}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
