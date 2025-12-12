
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import TableViewIcon from '@mui/icons-material/TableView';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Link } from 'react-router-dom';
import './../App.css'
import RegistroEquipos from "../components/Formularios/Formu_equipos"
import FORM_Torneos from '../components/Formularios/Formu_torneos';
import FORM_Categoria from '../components/Formularios/Form_categoria';
import FORM_Subcategoria from '../components/Formularios/Form_subcategoria';
import FORM_Groups from '../components/Formularios/Formu_grupos';
import FORM_Matches from '../components/Formularios/Formu_partidos';
import FORM_Players from '../components/Formularios/Formu_jugadores';
import AdminClasificacion from '../components/Clasificacion/ClasificacionAdmin';
import FORM_Eliminatorias from '../components/Formularios/Form_eliminatorias';
import LogoutButton from '../components/Login/CerrarSesion';
import Logo from "../assets/Frame 22.svg"
import LogoutIcon from "@mui/icons-material/Logout";
import GroupWorkIcon from '@mui/icons-material/GroupWork'; 
import FolderIcon  from '@mui/icons-material/Folder';              
import ListAltIcon from '@mui/icons-material/ListAlt';              
import { FaProjectDiagram } from "react-icons/fa";
            
const NAVIGATION = [
  {
    kind: 'header',
    title: 'Configuraciones',
  },
  
  {
    segment: 'torneos',
    title: 'Torneos',
    icon: <EmojiEventsIcon />, 
    link: <Link to="/torneos">Torneos</Link>
  },
  {
    segment: 'categorias',
    title: 'Categorias',
    icon: <FolderIcon  />, 
    link: <Link to="/categorias">Categorias</Link>
  },
  {
    segment: 'subcategorias',
    title: 'Subcategorias',
    icon: <ListAltIcon />,
    link: <Link to="/subcategorias">Subcategorias</Link>
  },
  {
    segment: 'grupos',
    title: 'Grupos',
    icon: <GroupWorkIcon />, 
    link: <Link to="/grupos">Grupos</Link> 
  },
  {
    segment: 'dashboard',
    title: 'Equipos',
    icon: <GroupsIcon />, 
    link: <Link to="/dashboard">Equipos</Link>
  },
  {
    segment: 'eliminatorias',
    title: 'Eliminatorias',
    icon:  <FaProjectDiagram />,
    link: <Link to="/eliminatorias">Eliminatorias</Link> 
  },
  {
    segment: 'partidos',
    title: 'Partidos',
    icon: <SportsSoccerIcon />,
    link: <Link to="/partidos">Partidos</Link>
  },
  {
    segment: 'clasificacion',
    title: 'Clasificación',
    icon: <TableViewIcon />,
    link: <Link to="/clasificacion">Clasificación</Link>
  },
  {
    segment: 'jugadores',
    title: 'Jugadores',
    icon: <GroupIcon />,
    link: <Link to="/jugadores">Jugadores</Link>
  },
  {
    kind: 'divider',
  },
  {
    segment: 'logout',
    title: 'Cerrar sesión',
    icon: <LogoutIcon />,
    link: <Link to="/logout">Cerrar sesión</Link>
  },

  
];

  
const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  // palette: {
  //   mode: 'light', //modo blanco
  //   primary: {
  //     main: '#ff5722', //  color texto menu
  //   },
  //   secondary: { 
  //     main: '#03a9f4', //  color secundario color texto menu
  //   },
  //   background: {
  //     default: '#e61010', //  fondo modo blanco contenido
  //     paper: '#230505', // fondo  modo blanco menus
  //   },
  //   text: {
  //     primary: '#ffffff', // Color texto  modo blanco
  //     secondary: '#24d238', // Color del texto centro menu en modo blanco
  //   },
  // },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#09537E', // color texto menu
        },
        secondary: {
          main: '#03a9f4', //  color secundario color texto menu
        },
        background: {
          default: '#f5f5f5', // fondo modo blanco contenido
          // paper: '#e4e1e1', // fondo  modo blanco menus
          paper: '#c8c4c4', 
          // paper: '#b2afb2', 
          // paper: '#d4d4d4', 
                 
        },
        text: {
          primary: '#152039', //  Color texto  modo blanco
          secondary: '#000000', //  Color del texto centro menu en modo blanco
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: '#ffffff', // Color primario para el modo oscuro
        },
        secondary: {
          main: '#29b6f6', // Color secundario para el modo oscuro
        },
        background: {
          default: '#303030', // Fondo general para el modo oscuro
          paper: '#424242', // Fondo de elementos tipo "papel" en modo oscuro
        },
        text: {
          primary: '#ffffff', // Texto principal en modoo oscuro
          secondary: '#bbbbbb', // Texto secundario en modo oscuro
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

// eslint-disable-next-line react/prop-types
function DemoPageContent({ pathname, setIsAuthenticated }) {
  let content;
  switch (pathname) {
    case '/dashboard':
      content = <RegistroEquipos />;
      break;
      case '/torneos':
        content = <FORM_Torneos />;
        break;
    case '/categorias':
      content = <FORM_Categoria />;
      break;
      case '/subcategorias':
        content = <FORM_Subcategoria />;
        break;
    case '/grupos':
      content = <FORM_Groups />;
      break;
      case '/partidos':
        content = <FORM_Matches />;
        break;
        case '/jugadores':
          content = <FORM_Players />;
          break;
          case '/clasificacion':
            content = <AdminClasificacion />;
            break;
            case '/eliminatorias':
              content = <FORM_Eliminatorias />;
              break;
              case '/logout':
                content = <LogoutButton setIsAuthenticated={setIsAuthenticated} />;
                break;
                case '/':
                  content = <FORM_Eliminatorias  />;
                  break;
    default:
      content = <Typography><h3>Selecciona una opción del menú</h3></Typography>;
  }

  return (
    <Box
      sx={{
        py: 3,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        textAlign: 'left',
      }}
    >   
      {content}
    </Box>
  );
}

import { useNavigate } from 'react-router-dom';

function DashboardLayoutBasic(props) {
  const { window, setIsAuthenticated } = props;
  const [pathname, setPathname] = React.useState('/torneos');
  const navigate = useNavigate(); // Agrega useNavigate

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        if (path === 'logout') {
          setIsAuthenticated(false);
          localStorage.removeItem('token');
          navigate('/login'); // Redirige correctamente
        } else {
          setPathname(String(path));
        }
      },
    };
  }, [pathname, setIsAuthenticated, navigate]); // Asegúrate de incluir navigate en las dependencias

  return (
    <AppProvider
    branding={{
      logo: <img src={Logo} alt="Logo" />,
      title: 'Panel Admin',
    
    }}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={window}
    >
      <DashboardLayout>
        <DemoPageContent pathname={pathname} setIsAuthenticated={setIsAuthenticated} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {

  window: PropTypes.func,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default DashboardLayoutBasic;
