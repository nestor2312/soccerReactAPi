/* eslint-disable react/prop-types */
// import "./index.css";
// import { useEffect } from "react";

// const Login = () => {
//   useEffect(() => {
//     // Cambiar el color de fondo del body cuando se monta el componente
//     document.body.style.background = "linear-gradient(180deg, #152039 0%, rgba(0, 191, 99, 0.80) 100%)"; 
//     // Restaurar el color de fondo original cuando el componente se desmonte
//     return () => {
//       document.body.style.backgroundColor = ""; // Restablece el fondo original
//     };
//   }, []);

//   return (
//     <>
//       <div className="posicion">
//         <div className="caja">
//           <h2>Iniciar sesión</h2>
//           <form action="">
//             <input type="text" id="fname" placeholder="Usuario" name="fname" />
//             <input
//               type="password"
//               id="lname"
//               placeholder="Contraseña"
//               name="lname"
//             />
//             <p>¿No tienes cuenta?</p>
//             <p>Registrarse</p>
//           </form>
//             <button>Ingresar</button>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;



import  { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINT } from '../../ConfigAPI';
import { Link, useNavigate } from 'react-router-dom';

const endpoint = API_ENDPOINT;
const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();  // Hook para redirección

    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
          // Obtener el CSRF token
          await axios.get(`${endpoint}/sanctum/csrf-cookie`);
          
          // Enviar credenciales de login
          const response = await axios.post(`${endpoint}login`, { email, password });
          
          // Almacenar token de sesión (opcionalmente podrías obtener un token del servidor)
          sessionStorage.setItem('token', response.data.token);  // Si tu backend devuelve un token
          
          setIsAuthenticated(true); 
          navigate('/profile'); // Marcar como autenticado en la app
          console.log('Logged in:', response.data);
      } catch (error) {
          console.log(error);
          setError('Login failed. Please check your credentials.');
      }
  };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Login;


