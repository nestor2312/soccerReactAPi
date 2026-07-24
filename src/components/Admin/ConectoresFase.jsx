/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./esilosElin.css";

const ConectoresFase = ({ cantidad, altura, esFaseFinal }) => {
  return (
    <div className="conectores">
      {Array.from({ length: cantidad }).map((_, i) => (
        <div 
          className="conector" 
          key={i} 
          style={{ height: `${altura}px` }} 
        >
          {/* EL CUADRADO: Lo renderizamos SIEMPRE para que ocupe su espacio y no desacomode la raya larga */}
          <div 
            className="conector_doble"
           style={{
  height: `${altura}px`,
  // Si es la final, aplicamos el degradado, sino, dejamos el estilo estándar

  // Bordes transparentes para que se vea el degradado de fondo
  
  // Aplicamos las esquinas redondeadas solo a la derecha
  borderTopRightRadius: esFaseFinal ? "3px" : "3px",
  borderBottomRightRadius: esFaseFinal ? "3px" : "3px",
  
  // Quitamos el borde izquierdo para que parezca una "U" o conector
  borderLeft: "none"
}}
          ></div>
          
          {/* LA RAYA LARGA: Ahora se mantendrá en su posición correcta porque el cuadrado la está empujando */}
          <div className="conector_simple"></div>
        </div>
      ))}
    </div>
  );
};

export default ConectoresFase;