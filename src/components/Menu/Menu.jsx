import { useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./index.css";
import Logo from "../../assets/Frame 22.svg"
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
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
  <Link to="/">
    <img className="LOGO" src={Logo} alt="Nombre de la Web Logo" />
  </Link>
</div>
  
    <div className={`navbar-links ${isOpen ? "open" : ""}`}>
      <Link to={`/torneo/categoria/${categoriaId}/subcategoria`} className="nv">
      <ArrowBackOutlinedIcon/> Subcategoria
      </Link>
      <Link
        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/inicio`}
        className={`nv ${location.pathname.includes('inicio') ? 'active' : ''}`}
      >
        Inicio
      </Link>
      <Link
        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/partidos`}
        className={`nv ${location.pathname.includes('partidos') ? 'active' : ''}`}
      >
        Partidos
      </Link>
      <Link
        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/jugadores`}
        className={`nv ${location.pathname.includes('jugadores') ? 'active' : ''}`}
      >
        Jugadores
      </Link>
      <Link
        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/clasificacion`}
        className={`nv ${location.pathname.includes('clasificacion') ? 'active' : ''}`}
      >
        Clasificación
      </Link>
      <Link
        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/equipos`}
        className={`nv ${location.pathname.includes('equipos') ? 'active' : ''}`}
      >
        Equipos
      </Link>
      <Link
        to={`/torneo/categoria/${categoriaId}/subcategoria/${subcategoriaId}/estadisticas`}
        className={`nv ${location.pathname.includes('estadisticas') ? 'active' : ''}`}
      >
        Estadisticas
      </Link>
    </div>
  
    <div className="navbar-toggle" onClick={toggleMenu}>
      {isOpen ? (
        <span className="close-btn">✖</span>
      ) : (
        <button className="navbar-toggler barr">☰</button>
      )}
    </div>
  </nav>
  
  );
};

export default Menu;
