/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINT } from '../../ConfigAPI';
import PropTypes from 'prop-types';
import LogoutIcon from '@mui/icons-material/Logout';
const endpoint = API_ENDPOINT;

const LogoutButton = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Recuperar el token de sessionStorage
            const token = sessionStorage.getItem('token');
            if (!token) {
                throw new Error('No hay token disponible');
            }

            // Hacer solicitud al backend para cerrar sesión
            await axios.post(
                `${endpoint}logout`, 
                {}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Agregar el token en el encabezado
                    },
                }
            );

            // Eliminar el token de sessionStorage y actualizar estado
            sessionStorage.removeItem('token');
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    };

    return (
        <>
        <div className="dropdown">
  <button
    type="button"
    className="btn btn-light dropdown-toggle"
    data-bs-toggle="dropdown"
    aria-expanded="false"
  >
    <span className="d-none d-md-inline">Cerrar sesión</span>
    <i className="fas fa-sign-out-alt d-md-none"><LogoutIcon /></i>
  </button>
  <ul className="dropdown-menu dropdown-menu-end">
    <li>
      <h6 className="dropdown-header">¿Desea cerrar sesión?</h6>
    </li>
    <li className="d-flex justify-content-center">
      <button
        className="btn btn-outline-danger w-75"
        onClick={handleLogout}
      >
        Confirmar
      </button>
    </li>
  </ul>
</div>

        </>
    );
};

LogoutButton.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default LogoutButton;
