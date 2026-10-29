import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../../ConfigAPI';
import Logo from "../../assets/Frame_49.png";
import Swal from "sweetalert2"; // 1. Importar SweetAlert2

const endpoint = API_ENDPOINT;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();  // Hook para redirección

    useEffect(() => {
        document.title = "Registrarse";
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        // 2. Alerta si las contraseñas no coinciden
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Las contraseñas no coinciden.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        try {
            const response = await axios.post(`${endpoint}register`, {
                name,
                email,
                password,
                password_confirmation: confirmPassword,  
            });

            // Si el registro es exitoso, guardamos el token y redirigimos
            sessionStorage.setItem('token', response.data.token);  
            navigate('/registrar_datos');  
        } catch (err) {
            console.log(err);
            // 3. Alerta si falla la petición al backend
            Swal.fire({
                icon: 'error',
                title: '¡Oops...',
                text: err.response?.data?.message || 'Solo se puede registrar un usuario y ya fue registrado.',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    return (
        <div>
            <div className="posicion">
                <div className="caja2">
                    <img className="mb-3 LOGO" src={Logo} alt="LOGO" />
                    <h2 className="text-login">Crear una cuenta</h2>
                    <form onSubmit={handleRegister} className='form-registro'>
                        <div>
                            <input className='form-register login-input' placeholder="Ingresar nombre" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div>
                            <input className='form-register login-input' placeholder="Ingresar correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <input className='form-register login-input' placeholder="Ingresar una contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div>
                            <input className='form-register login-input' placeholder="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className='btn-button-general'>Crear cuenta</button>
                        <h1 className="text-login"><Link to="/login" className='link-login'>Iniciar sesion</Link></h1>
                    </form>
                    {/* Se removió el {error && <p>{error}</p>} de aquí abajo */}
                </div>
            </div>
        </div>
    );
};

export default Register;