import "./index.css"

import Logo from "../../assets/Logo_liga.png"
const Footer =()=>{
    return <>
    <footer className="mt-2">
        <div>
             <img
                           src={`${Logo}`}
                          
                           className="logo_footer"
                           alt={Logo}
                           onError={(e) => {
                             e.target.onerror = null;
                            
                             e.target.classList.add("error-logo");
                           }}
                         />
        </div>
        <p className="text_footer" >&copy; 2025 Fubol Todos los derechos reservados <br/>
        Desarrollado y diseñado por <strong>Nestor Canal</strong> </p>
        
    </footer>
    </>
}
export default Footer