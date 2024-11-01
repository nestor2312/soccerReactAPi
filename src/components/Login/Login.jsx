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



// import  { useState } from 'react';
// import axios from 'axios';
// import { API_ENDPOINT } from '../../ConfigAPI';
// import { Link, useNavigate } from 'react-router-dom';

// const endpoint = API_ENDPOINT;
// const Login = ({ setIsAuthenticated }) => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);

//     const navigate = useNavigate();  // Hook para redirección

//     const handleLogin = async (e) => {
//         e.preventDefault();
      
//         try {
//           // Obtener el token CSRF antes del login
//           await axios.get(`${endpoint}sanctum/csrf-cookie`);
          
//           // Enviar solicitud de login
//           const response = await axios.post(`${endpoint}login`, { email, password });
          
//           // Verificar si se ha recibido el token o los datos correctos
//           console.log(response.data);  // Revisa qué datos devuelve el servidor
      
//           // Almacenar token si es necesario (si el backend envía un token)
//           sessionStorage.setItem('token', response.data.token);
//           localStorage.setItem('token', response.data.token);
//           // Marcar autenticación exitosa
//           setIsAuthenticated(true);
//           navigate('/profile');
//         } catch (error) {
//           console.log(error.response);  // Revisa los errores que devuelve el backend
//           setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
//         }
//       };
      
//     return (
        
//         <div>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <div>
//                     <label>Email:</label>
//                     <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//                 </div>
//                 <button type="submit">Login</button>
//             </form>
//             <p>¿No tienes cuenta? <Link to="/register">Registrarse</Link></p>
//             {error && <p>{error}</p>}
//         </div>
//     );
// };

// export default Login;



import "./index.css";
import { useEffect, useState } from "react";
import axios from 'axios';
import { API_ENDPOINT } from '../../ConfigAPI';
import { Link, useNavigate } from 'react-router-dom';
import CargaSesion from "../Carga/carga_sesion";

const endpoint = API_ENDPOINT;

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();  // Hook para redirección

    const handleLogin = async (e) => {
      setIsLoading(true);
        e.preventDefault();
      
        try {
          // Obtener el token CSRF antes del login
          await axios.get(`${endpoint}sanctum/csrf-cookie`);
          
          // Enviar solicitud de login
          const response = await axios.post(`${endpoint}login`, { email, password });
          
          // Verificar si se ha recibido el token o los datos correctos
          console.log(response.data);  // Revisa qué datos devuelve el servidor
      
          // Almacenar token si es necesario (si el backend envía un token)
          sessionStorage.setItem('token', response.data.token);
          localStorage.setItem('token', response.data.token);
          // Marcar autenticación exitosa
          setIsAuthenticated(true);

          navigate('/registrar_datos');
        } catch (error) {
          console.log(error.response);  // Revisa los errores que devuelve el backend
          setError(error.response?.data?.message || 'Error al iniciar sesión. Verifique sus datos.');
        }finally {
          setIsLoading(false); // Terminar la carga
        }
      };
      
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
          <h2 className="text-login" >Iniciar sesión</h2>
          <form onSubmit={handleLogin}>
          <input type="email"  placeholder="Correo" className="login-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password"  placeholder="Contraseña" className="login-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
         
            <p>¿No tienes cuenta?</p>
            <p><Link to="/register" className='link-login'>Registrarse</Link></p>

            <button type="submit" className="btn-button-general">
          ingresar
            </button>
          </form>
            {error && <p>{error}</p>}
           
        </div>
      </div>
        {isLoading ? (
                  <CargaSesion/>
                  ) : (
                   ''
                  )}
    </>
  );
};

export default Login;





