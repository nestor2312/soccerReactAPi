import "./index.css";
import { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    // Cambiar el color de fondo del body cuando se monta el componente
    document.body.style.background = "linear-gradient(180deg, #152039 0%, rgba(0, 191, 99, 0.80) 100%)"; 
    // Restaurar el color de fondo original cuando el componente se desmonte
    return () => {
      document.body.style.backgroundColor = ""; // Restablece el fondo original
    };
  }, []);

  return (
    <>
      <div className="posicion">
        <div className="caja">
          <h2>Iniciar sesión</h2>
          <form action="">
            <input type="text" id="fname" placeholder="Usuario" name="fname" />
            <input
              type="password"
              id="lname"
              placeholder="Contraseña"
              name="lname"
            />
            <p>¿No tienes cuenta?</p>
            <p>Registrarse</p>
          </form>
            <button>Ingresar</button>
        </div>
      </div>
    </>
  );
};

export default Login;
