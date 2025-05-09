import React, { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, useLocation, Link } from "react-router-dom"
import logo from "../img/logo.png"
import "../css/MainPage.css"
import { getUserBusinesses } from "../services/apiBusiness"
import { getAuth } from "firebase/auth"
import { Container, Navbar as BootstrapNavbar, Nav, Button, Dropdown } from "react-bootstrap"
import NotificationIcon from "./NotificationIcon"
import NotificationDropdown from "./NotificationDropdown"
import { io } from "socket.io-client"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [hasBusinesses, setHasBusinesses] = useState(false)
  const [userBusinesses, setUserBusinesses] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationRef = React.useRef(null)
  const userDropdownRef = React.useRef(null)

  useEffect(() => {
    const publicRoutes = ["/login", "/privacidad", "/terminos", "/negocio"];
    if (
      !user &&
      !publicRoutes.some((route) => location.pathname === route || location.pathname.startsWith(route + "/"))
    ) {
      navigate("/");
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (user) {
        try {
          const auth = getAuth()
          const token = await auth.currentUser.getIdToken(true)
          const businesses = await getUserBusinesses(token)
          setHasBusinesses(businesses.length > 0)
          setUserBusinesses(businesses)
        } catch (e) {
          setHasBusinesses(false)
          setUserBusinesses([])
        }
      } else {
        setHasBusinesses(false)
        setUserBusinesses([])
      }
    }
    fetchBusinesses()
  }, [user])

  // Obtener notificaciones si el usuario está logueado
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return setNotifications([])
      try {
        const token = await getAuth().currentUser.getIdToken()
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/notificaciones/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
          const data = await res.json()
          setNotifications(data)
        }
      } catch (e) {
        setNotifications([])
      }
    }
    fetchNotifications()
  }, [user])

  // Socket.IO: conectar y registrar UID
  useEffect(() => {
    let socket
    if (user) {
      socket = io(process.env.REACT_APP_API_URL, { transports: ["websocket"] })
      socket.on("connect", () => {
        socket.emit("register", user.uid)
      })
      socket.on("nueva_notificacion", (notification) => {
        setNotifications((prev) => [notification, ...prev])
      })
    }
    return () => {
      if (socket) socket.disconnect()
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev)
    // Marcar todas como leídas al abrir
    if (unreadCount > 0) {
      const ids = notifications.filter((n) => !n.read).map((n) => n._id)
      getAuth()
        .currentUser.getIdToken()
        .then((token) => {
          fetch(`${process.env.REACT_APP_API_URL}/api/turnos/notificaciones/marcar-leidas`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ ids }),
          }).then(() => {
            setNotifications(notifications.map((n) => ({ ...n, read: true })))
          })
        })
    }
  }

  const handleMarkRead = (id) => {
    setNotifications(notifications.map((n) => (n._id === id ? { ...n, read: true } : n)))
  }

  const handleClearAll = async () => {
    if (!user) return
    try {
      const token = await getAuth().currentUser.getIdToken()
      await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/notificaciones/limpiar-todas`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      })
      // Vuelve a pedir las notificaciones actualizadas
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/notificaciones/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      } else {
        setNotifications([])
      }
    } catch (e) {
      // Opcional: mostrar error
    }
  }

  const handleCloseNotifications = () => {
    setShowNotifications(false)
  }

  // Cerrar el dropdown de notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Para notificaciones
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        showNotifications &&
        !event.target.closest(".notification-icon-wrapper")
      ) {
        setShowNotifications(false)
      }
    }

    // Añadir evento de clic para dispositivos táctiles
    document.addEventListener("click", handleClickOutside, { capture: true })
    // Añadir evento de toque para dispositivos móviles
    document.addEventListener("touchend", handleClickOutside, { capture: true })

    return () => {
      document.removeEventListener("click", handleClickOutside, { capture: true })
      document.removeEventListener("touchend", handleClickOutside, { capture: true })
    }
  }, [showNotifications])

  // Cerrar dropdowns al cambiar de ruta
  useEffect(() => {
    setShowNotifications(false)
  }, [location.pathname])

  return (
    <BootstrapNavbar expand="lg" className="navbar-light bg-white shadow-sm py-2">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img src={logo || "/placeholder.svg"} alt="ReservaTurnos" height="50" className="me-2" />
        </BootstrapNavbar.Brand>
        
    
        {user && (
          <>
            <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
            <BootstrapNavbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto">
                <Nav.Link as={Link} to="/como-funciona" className="mx-2">
                  Cómo funciona
                </Nav.Link>
                <Nav.Link as={Link} to="/precios" className="mx-2">
                  Precios
                </Nav.Link>
                <Nav.Link as={Link} to="/contacto" className="mx-2">
                  Contacto
                </Nav.Link>
              </Nav>
              {/* ...resto de la UI para usuario logueado... */}
              <div className="d-flex align-items-center">
                {user && (
                  <div className="position-relative me-2">
                    <NotificationIcon unreadCount={unreadCount} onClick={handleNotificationClick} />
                    {showNotifications && (
                      <div ref={notificationRef} className="notification-container">
                        <NotificationDropdown
                          notifications={notifications}
                          onMarkRead={handleMarkRead}
                          onClose={handleCloseNotifications}
                          onClearAll={handleClearAll}
                        />
                      </div>
                    )}
                  </div>
                )}

                <Dropdown align={{ lg: "end" }}>
                  <Dropdown.Toggle
                    as="div"
                    className="d-flex align-items-center user-dropdown-toggle"
                    style={{ cursor: "pointer" }}
                    ref={userDropdownRef}
                  >
                    <img
                      src={user.photoURL || "/placeholder.svg"}
                      alt="Perfil"
                      className="rounded-circle"
                      style={{ width: "38px", height: "38px" }}
                    />
                    <span className="ms-2 d-none d-md-inline">{user.displayName}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow border-0 user-dropdown-menu">
                    <Dropdown.Item onClick={() => navigate("/crear-negocio")}>
                      <i className="bi bi-plus-circle me-2"></i> Crear negocio
                    </Dropdown.Item>

                    {hasBusinesses && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Header>Administrador de Negocios</Dropdown.Header>
                        <Dropdown.Item onClick={() => navigate("/tu-perfil")}>
                          <i className="bi bi-briefcase me-2"></i> Mis negocios
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            if (userBusinesses.length > 0) {
                              navigate(`/negocio/${userBusinesses[0]._id}?tab=clientes`)
                            }
                          }}
                        >
                          <i className="bi bi-people me-2"></i> Mis clientes
                        </Dropdown.Item>
                      </>
                    )}

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => navigate("/mis-turnos")}>
                      <i className="bi bi-calendar-check me-2"></i> Mis turnos
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i> Desconectarse
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </BootstrapNavbar.Collapse>
          </>
        )}

        {!user && (
          <div className="ms-auto">
            <Button variant="primary" onClick={() => navigate("/login")} className="rounded-pill px-4">
              Iniciar sesión
            </Button>
          </div>
        )}
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
