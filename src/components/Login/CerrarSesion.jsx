import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { API_ENDPOINT } from "../../ConfigAPI";
import CerrarSesion from "../../assets/CerrarSesion.png"


const LogoutButton = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false); // Estado para mostrar la imagen de carga

    const handleLogout = async () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Quieres cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar sesión",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setIsLoading(true); 
                    const token = sessionStorage.getItem("token");
                    if (!token) throw new Error("No hay token disponible");

                    await axios.post(
                        `${API_ENDPOINT}logout`,
                        {},
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    sessionStorage.removeItem("token");
                    setIsAuthenticated(false);
                    navigate("/login");
                } catch (error) {
                    console.error("Logout failed:", error.response?.data || error.message);
                } finally {
                    setIsLoading(false); // 🟢 Desactiva la imagen de carga después del proceso
                }
            }
        });
    };

    return (
        <div>
            <button className="btn btn-outline-info w-50 mt-1" onClick={handleLogout}>
                Cerrar sesión
            </button>
            
            {isLoading && (
                <div>
                 <img  className="cargandologin" src={CerrarSesion} alt="Cerrando sesión..." />
                </div>
            )}
        </div>
    );
};

LogoutButton.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default LogoutButton;
