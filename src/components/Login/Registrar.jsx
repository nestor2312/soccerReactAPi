import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../../ConfigAPI';

const endpoint = API_ENDPOINT;

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();  // Hook para redirección

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

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button type="submit">Register</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Register;
