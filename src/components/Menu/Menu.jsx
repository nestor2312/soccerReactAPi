import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./index.css";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { categoriaId, subcategoriaId } = useParams();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Logo</h1>
      </div>

      {/* Botón de menú para móviles */}
      <div className="navbar-toggle" onClick={toggleMenu}>
        {isOpen ? (
          <span className="close-btn">X</span>
        ) : (
          <button className="navbar-toggler">☰</button>
        )}
      </div>

      {/* Menú de enlaces */}
      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        <Link to={`/torneo`} className="nv" onClick={closeMenu}>
          ← Copas
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/inicio`}
          className={`nv ${location.pathname.includes("inicio") ? "active" : ""}`}
          onClick={closeMenu}
        >
          Inicio
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/partidos`}
          className={`nv ${location.pathname.includes("partidos") ? "active" : ""}`}
          onClick={closeMenu}
        >
          Partidos
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores`}
          className={`nv ${location.pathname.includes("jugadores") ? "active" : ""}`}
          onClick={closeMenu}
        >
          Jugadores
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/clasificacion`}
          className={`nv ${location.pathname.includes("clasificacion") ? "active" : ""}`}
          onClick={closeMenu}
        >
          Clasificación
        </Link>
        <Link
          to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/equipos`}
          className={`nv ${location.pathname.includes("equipos") ? "active" : ""}`}
          onClick={closeMenu}
        >
          Equipos
        </Link>
      </div>
    </nav>
  );
};

export default Menu;
