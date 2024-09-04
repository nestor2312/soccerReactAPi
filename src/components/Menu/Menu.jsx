import { Link } from "react-router-dom"
import "./index.css"
const Menu =()=>{
    return <>
     <section className="Subcategoria">
      <nav className="navbar navbar-expand-md nav-color">
       
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav">
            <li>
              <Link to={`/`}>Inicio</Link>
            </li>
            <li>
              <Link to={`/partidos`}>Partidos</Link>
            </li>
            <li>
              <Link to={`/jugadores`}>Jugadores</Link>
            </li>
            <li>
              <Link to={`/clasificacion`}>Tabla de clasificación</Link>
            </li>
            <li>
              <Link to={`/equipos`}>Equipos</Link>
            </li>
            <li>
              <Link to={`/registrar`}>Registrar informacion</Link>
            </li>
          </ul>
        </div>
      </nav>
    </section>
    </>
}
export default Menu