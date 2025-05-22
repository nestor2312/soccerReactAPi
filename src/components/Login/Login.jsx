import "./index.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINT } from "../../ConfigAPI";
import { Link, useNavigate } from "react-router-dom";
import CargaSesion from "../Carga/carga_sesion";
import Logo from "../../assets/Frame 22.svg"
const endpoint = API_ENDPOINT;

// eslint-disable-next-line react/prop-types
const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  const validateInputs = () => {
    const errors = {};
    if (!email.includes("@")) {
      errors.email = "Ingrese un correo válido.";
    }
    if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      await axios.get(`${endpoint}sanctum/csrf-cookie`);
      const response = await axios.post(`${endpoint}login`, { email, password });

      sessionStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      navigate("/registrar_datos");
    } catch (error) {
      setError(error.response?.data?.message || "Error al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  useEffect(() => {
    document.title = "Iniciar sesion";
  }, []);

  return (
    <>
      <div className="posicion">
        <div className="caja">
           <img  className="mb-3" src={Logo} alt="LOGO" />
          <h2 className="text-login">Iniciar sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
            <input
              type="password"
              placeholder="Contraseña"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <h6 className="error-message">{errors.password}</h6>}
            <p className="text-black ">
              ¿No tienes cuenta?{" "}
              <Link to="/register" className="link-login">
                Registrarse
              </Link>
            </p>
            <button type="submit" className="btn-button-general text-center" disabled={isLoading}>
              {isLoading ? "Cargando..." : "Ingresar"}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
      {isLoading && (
        <div className="loading-overlay">
          <CargaSesion />
        </div>
      )}
    </>
  );
};

export default Login;
