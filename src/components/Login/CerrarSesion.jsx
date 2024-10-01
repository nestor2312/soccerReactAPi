/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from '../../ConfigAPI';

const endpoint = API_ENDPOINT;

const LogoutButton = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Hacer solicitud al backend para cerrar sesión
            await axios.post(`${endpoint}/logout`);
            
            // Limpiar token del sessionStorage
            sessionStorage.removeItem('token'); 
            
            // Marcar como no autenticado
            setIsAuthenticated(false);

            // Redirigir al usuario a la página de inicio o de login
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button onClick={handleLogout}>Cerrar sesión</button>
    );
};

export default LogoutButton;
