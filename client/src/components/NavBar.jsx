"use client"

import React, { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, useLocation, Link } from "react-router-dom"
import logo from "../img/logo.png"
import "../css/MainPage.css"
import "../css/Navbar.css"
import { getUserBusinesses } from "../services/apiBusiness"
import { getAuth } from "firebase/auth"
import { Container, Navbar as BootstrapNavbar, Nav, Button } from "react-bootstrap"
import NotificationIcon from "./NotificationIcon"
import NotificationDropdown from "./NotificationDropdown"
import { io } from "socket.io-client"
import { FaPlus, FaBriefcase, FaUsers, FaCalendarCheck, FaSignOutAlt, FaChevronDown } from "react-icons/fa"

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [hasBusinesses, setHasBusinesses] = useState(false)
  const [userBusinesses, setUserBusinesses] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const notificationRef = React.useRef(null)
  const userDropdownRef = React.useRef(null)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767.98)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    const publicRoutes = ["/login", "/privacidad", "/terminos", "/negocio"]
    if (
      !user &&
      !publicRoutes.some((route) => location.pathname === route || location.pathname.startsWith(route + "/"))
    ) {
      navigate("/")
    }
  }, [user, navigate, location.pathname])

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

      // Para el dropdown de usuario
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target) &&
        dropdownOpen &&
        !event.target.closest(".user-dropdown-toggle")
      ) {
        setDropdownOpen(false)
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
  }, [showNotifications, dropdownOpen])

  // Cerrar dropdowns al cambiar de ruta
  useEffect(() => {
    setShowNotifications(false)
    setDropdownOpen(false)
  }, [location.pathname])

  // Función personalizada para manejar el dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

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
                <Nav.Link as={Link} to="/quienes-somos" className="mx-2">
                  Quienes Somos
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

                <div className="position-relative" ref={userDropdownRef}>
                  <div className="user-dropdown-toggle d-flex align-items-center" onClick={toggleDropdown}>
                    <img src={user.photoURL || "/placeholder.svg"} alt="Perfil" className="rounded-circle" />
                    <span className="user-name d-none d-md-inline">{user.displayName}</span>
                    <FaChevronDown className={`chevron-icon ${dropdownOpen ? "chevron-rotate" : ""}`} size={14} />
                  </div>

                  {dropdownOpen && (
                    <>
                      {isMobile && (
                        <div className="mobile-menu-overlay show" onClick={() => setDropdownOpen(false)}></div>
                      )}
                      <div className="user-dropdown-menu">
                        <div
                          onClick={() => {
                            navigate("/crear-negocio")
                            setDropdownOpen(false)
                          }}
                          className="dropdown-item"
                        >
                          <FaPlus className="text-primary" /> Crear negocio
                        </div>

                        {hasBusinesses && (
                          <>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-header">Administrador de Negocios</div>
                            <div
                              onClick={() => {
                                navigate("/tu-perfil")
                                setDropdownOpen(false)
                              }}
                              className="dropdown-item"
                            >
                              <FaBriefcase className="text-primary" /> Mis negocios
                            </div>
                            <div
                              onClick={() => {
                                if (userBusinesses.length > 0) {
                                  navigate(`/negocio/${userBusinesses[0]._id}?tab=clientes`)
                                  setDropdownOpen(false)
                                }
                              }}
                              className="dropdown-item"
                            >
                              <FaUsers className="text-primary" /> Mis clientes
                            </div>
                          </>
                        )}

                        <div className="dropdown-divider"></div>
                        <div
                          onClick={() => {
                            navigate("/mis-turnos")
                            setDropdownOpen(false)
                          }}
                          className="dropdown-item"
                        >
                          <FaCalendarCheck className="text-primary" /> Mis turnos
                        </div>
                        <div
                          onClick={() => {
                            logout()
                            setDropdownOpen(false)
                          }}
                          className="dropdown-item"
                        >
                          <FaSignOutAlt className="text-danger" /> Desconectarse
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </BootstrapNavbar.Collapse>
          </>
        )}

        {!user && (
          <div className="ms-auto">
            <Button variant="primary" onClick={() => navigate("/login")} className="rounded-pill px-4 btn-login">
              Iniciar sesión
            </Button>
          </div>
        )}
      </Container>
    </BootstrapNavbar>
  )
}

export default Navbar
