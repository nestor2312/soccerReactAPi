import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../../ConfigAPI';

const endpoint = API_ENDPOINT;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Hook para redirección

    useEffect(() => {
        document.title = "Registrarse";
      }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        // Verifica que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            const response = await axios.post(`${endpoint}register`, {
                name,
                email,
                password,
                password_confirmation: confirmPassword,  // Laravel requiere este campo
            });

            // Si el registro es exitoso, puedes iniciar sesión o redirigir al login
            sessionStorage.setItem('token', response.data.token);  // Si el backend envía un token
            navigate('/profile');  // Redirigir al perfil o a la página que prefieras
        } catch (error) {
            console.log(error);
            setError('Registration failed. Please check your input.');
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
        <div>
            <div className="posicion">
            <div className="caja2">
            <h2 className="text-login">Crear una cuenta</h2>
            <form onSubmit={handleRegister} className='form-registro'>
                <div>
                    <input className='form-register login-input'  placeholder="Ingresar nombre " type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                   
                    <input className='form-register login-input'  placeholder="Ingresar correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    
                    <input className='form-register login-input'  placeholder="Ingresar una contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    
                    <input className='form-register login-input'  placeholder="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit" className='btn-button-general'>Crear cuenta</button>
                <h1 className="text-login"><Link to="/login" className='link-login'>Iniciar sesion</Link></h1>
            </form>
            {error && <p>{error}</p>}
        </div>
        </div>
        </div>
    );
};

export default Register;
