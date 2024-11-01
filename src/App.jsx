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

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from "./components/Login/Login";
import Inicio from "./pages/Inicio";
import ProtectedRoute from './components/ProtectedRoute';
import Partidos from "./components/Partidos/Partidos";
import Equipos from "./components/Equipos/Equipos";
import Jugadores from "./components/Jugadores/Jugadores";
import Clasificacion from "./components/Clasificacion";
// import Registrar from "./components/Registrar/Registrar";
import Torneo from "./components/Torneo/Torneo";
import Categoria from "./components/Categoria/Categoria";
import Subcategoria from "./components/Subcategoria/Subcategoria";
// import Register from  "./components/Login/Registrar";





import { useEffect, useState } from 'react';
import Admin from './pages/Admin';

function App() {
  
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Verificar el token con el servidor
      // ...
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
      {/* <Route path="/clasificacion" element={<Clasificacion />} /> */}
      {/* <Route path="/equipos" element={<Equipos />} /> */}
      {/* <Route path="/partidos" element={<Partidos />} /> */}

      <Route path="/torneo" element={<Torneo />} />
        <Route path="/torneo/:id/categorias" element={<Categoria />} />
      <Route
          path="/torneo/categoria/:categoriaId/subcategoria"
          element={<Subcategoria />}
        />
        <Route
          path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/equipos"
          element={<Equipos />}
        />
        <Route
          path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/jugadores"
          element={<Jugadores />}
        />
        <Route
          path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/inicio"
          element={<Inicio />}
        />
        <Route
          path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/partidos"
          element={<Partidos />}
        />
        <Route
          path="/torneo/categoria/:categoriaId/subcategoria/:subcategoriaId/clasificacion"
          element={<Clasificacion />}
        />
      
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route
          path="/registrar_datos"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
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