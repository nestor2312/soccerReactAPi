import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./index.css";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { categoriaId, subcategoriaId } = useParams(); // Obtener los IDs dinámicos
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Logo</h1>
      </div>
      
      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
      <Link
          to={`/torneo`}
          className={`nv`}
        >
         ← Copas
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/inicio`}
          className={`nv ${location.pathname === `/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/inicio` ? 'active' : ''}`}
        >
          Inicio
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/partidos`}
          className={`nv ${location.pathname === `/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/partidos` ? 'active' : ''}`}
        >
          Partidos
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores`}
          className={`nv ${location.pathname === `/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores` ? 'active' : ''}`}
        >
          Jugadores
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/clasificacion`}
          className={`nv ${location.pathname === `/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/clasificacion` ? 'active' : ''}`}
        >
          Tabla de clasificación
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/equipos`}
          className={`nv ${location.pathname === `/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/equipos` ? 'active' : ''}`}
        >
          Equipos
        </Link>
      
           <Link to={`/registrar`}
          className={`nv `}
        >
          Registrar
        </Link>
      </div>

      {/* Ícono para abrir/cerrar el menú */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? (
          <span className="close-btn">X</span>
        ) : (
          <>
            {/* <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span> */}
            <button
            className="navbar-toggler barr"
            type="button"
            data-toggle="collapse"
            data-target="#collapsibleNavbar"
          >☰</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Menu;
