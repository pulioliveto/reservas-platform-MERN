import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../img/logo.png';
import '../css/MainPage.css';
import { getUserBusinesses } from '../services/apiBusiness';
import { getAuth } from 'firebase/auth';
import NotificationIcon from './NotificationIcon';
import NotificationDropdown from './NotificationDropdown';
import { io } from 'socket.io-client';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hasBusinesses, setHasBusinesses] = React.useState(false);
  const [userBusinesses, setUserBusinesses] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  useEffect(() => {
    if (!user && location.pathname !== '/login') {
      navigate('/'); // Redirige al home si el usuario no está autenticado y no está en la página de login
    }
  }, [user, navigate, location.pathname]); // Ejecuta el efecto cuando cambia el estado del usuario o la ubicación

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (user) {
        try {
          const auth = getAuth();
          const token = await auth.currentUser.getIdToken(true);
          const businesses = await getUserBusinesses(token);
          setHasBusinesses(businesses.length > 0);
          setUserBusinesses(businesses);
        } catch (e) {
          setHasBusinesses(false);
          setUserBusinesses([]);
        }
      } else {
        setHasBusinesses(false);
        setUserBusinesses([]);
      }
    };
    fetchBusinesses();
  }, [user]);

  // Obtener notificaciones si el usuario está logueado
  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return setNotifications([]);
      try {
        const token = await getAuth().currentUser.getIdToken();
        const res = await fetch('http://localhost:5000/api/turnos/notificaciones/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (e) { setNotifications([]); }
    };
    fetchNotifications();
  }, [user]);

  // Socket.IO: conectar y registrar UID
  React.useEffect(() => {
    let socket;
    if (user) {
      socket = io('http://localhost:5000', { transports: ['websocket'] });
      socket.on('connect', () => {
        socket.emit('register', user.uid);
      });
      socket.on('nueva_notificacion', (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      });
    }
    return () => {
      if (socket) socket.disconnect();
    };
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    // Marcar todas como leídas al abrir
    if (unreadCount > 0) {
      const ids = notifications.filter(n => !n.read).map(n => n._id);
      getAuth().currentUser.getIdToken().then(token => {
        fetch('http://localhost:5000/api/turnos/notificaciones/marcar-leidas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ ids })
        }).then(() => {
          setNotifications(notifications.map(n => ({ ...n, read: true })));
        });
      });
    }
  };

  const handleMarkRead = (id) => {
    setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
  };

  const handleClearAll = async () => {
    if (!user) return;
    try {
      const token = await getAuth().currentUser.getIdToken();
      await fetch('http://localhost:5000/api/turnos/notificaciones/limpiar-todas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      setNotifications([]);
    } catch (e) {
      // Opcional: mostrar error
    }
  };

  const handleLogoToHome = () => {
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <img src={logo} alt="logo de la web" onClick={handleLogoToHome} style={{ height: '100px', margin: "0px", padding: "0px", cursor: "pointer" }} />
        <div className="ml-auto">
          {user ? (
            <div className="d-flex align-items-center">
              {user && (
                <div style={{ position: 'relative', marginRight: '18px' }}>
                  <NotificationIcon unreadCount={unreadCount} onClick={handleNotificationClick} />
                  {showNotifications && (
                    <div style={{ position: 'absolute', right: 0, zIndex: 1000 }}>
                      <NotificationDropdown notifications={notifications} onMarkRead={handleMarkRead} onClearAll={handleClearAll} />
                    </div>
                  )}
                </div>
              )}
              <div className="dropdown">
                <img
                  src={user.photoURL}
                  alt="Foto de perfil"
                  className="rounded-circle"
                  style={{ width: "40px", height: "40px", marginRight: "10px", cursor: "pointer" }}
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                />
                <span
                  style={{ marginRight: "10px", cursor: "pointer" }}
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.displayName} <i className="bi bi-caret-down-fill"></i>
                </span>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/crear-negocio')}>
                      <i className="bi bi-plus-circle"></i> Crear negocio
                    </button>
                  </li>
                  {hasBusinesses && (
                    <>
                      <li><hr className="dropdown-divider" /></li>
                      <li className="dropdown-header">Administrador de Negocios</li>
                      <li>
                        <button className="dropdown-item" onClick={() => navigate('/tu-perfil')}>
                          <i className="bi bi-briefcase"></i> Mis negocios
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={() => {
                          if (userBusinesses.length > 0) {
                            navigate(`/negocio/${userBusinesses[0]._id}?tab=clientes`);
                          }
                        }}>
                          <i className="bi bi-people"></i> Mis clientes
                        </button>
                      </li>
                    </>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/mis-turnos')}>
                      <i className="bi bi-calendar-check"></i> Mis turnos
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={logout}>
                      <i className="bi bi-box-arrow-right"></i> Desconectarse
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
