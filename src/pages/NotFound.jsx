import './../App.css'
import { useEffect } from "react";
import Imagen from "../assets/NotFound.svg"
const NotFound = () => {
  useEffect(() => {
    document.title = "Pagina no disponible";
  }, []);


    return (
      // <div className="NotFound">
      // <div style={{ textAlign: "center", padding: "2rem" }}>
      //   <h1 >Página no encontrada (404)</h1>
      //   <p>Lo sentimos, la página que buscas no existe.</p>
        
      // </div>

      // </div>
      <>
      <div className="NotFound">
  <div className="cajaNotFound">
 
    <h1 className="textNotFound">Página no encontrada 404</h1>
    <h2 className="textNotFound"> Lo sentimos, la página que buscas no existe.</h2>
  <img  className="mb-1 imgNotFound" src={Imagen} alt="LOGO" />

  </div>
</div>
     
    </>
    );
  };
  
  export default NotFound;