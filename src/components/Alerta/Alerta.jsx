/* eslint-disable react/prop-types */
import { useEffect } from "react";

const Alert = ({ mensaje, tipo, onClose }) => {
  useEffect(() => {
    if (mensaje && onClose) {
      const timer = setTimeout(() => {
        onClose(); 
      }, 3000); //tiempo (3 segundos )
      return () => clearTimeout(timer);
    }
  }, [mensaje, onClose]);

  return mensaje ? (
    <div className={`alert alert-${tipo}`} role="alert">
      {mensaje}
    </div>
  ) : null;
};

export default Alert;
