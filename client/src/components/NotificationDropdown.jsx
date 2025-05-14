"use client"

import { useRef, useEffect, useState } from "react"
import { FaBell, FaCheck, FaTrashAlt, FaRegBell, FaTimes } from "react-icons/fa"
import { format, isToday, isYesterday } from "date-fns"
import { es } from "date-fns/locale"
import "../css/Notification.css"

const NotificationDropdown = ({ notifications = [], onMarkRead, onClearAll, onClose }) => {
  const dropdownRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 576)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isToday(date)) {
      return `Hoy, ${format(date, "HH:mm", { locale: es })}`
    } else if (isYesterday(date)) {
      return `Ayer, ${format(date, "HH:mm", { locale: es })}`
    } else {
      return format(date, "d MMM, HH:mm", { locale: es })
    }
  }

  // Función para formatear las etiquetas de acción (Reservó/Canceló)
  const formatActionLabels = (text) => {
    let formattedText = text.replace(/\b(Reservó)\b/g, '<span class="action-label reserved">Reservó</span>')
    formattedText = formattedText.replace(/\b(Canceló)\b/g, '<span class="action-label canceled">Canceló</span>')
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />
  }

  // Efecto para añadir animación al abrir
  useEffect(() => {
    const dropdown = dropdownRef.current
    if (dropdown) {
      dropdown.classList.add("show-dropdown")
    }
  }, [])

  // Manejar clic en el título para cerrar en móvil
  const handleTitleClick = () => {
    if (isMobile) {
      onClose()
    }
  }

  return (
    <>
      {isMobile && <div className="mobile-overlay" onClick={onClose}></div>}
      <div className="notification-dropdown" ref={dropdownRef}>
        <div className="notification-header">
          <div
            className="notification-title"
            onClick={handleTitleClick}
            role="button"
            aria-label="Notificaciones - Toca para cerrar en móvil"
          >
            <FaBell className="me-2 text-primary" />
            <h6 className="mb-0 fw-bold">Notificaciones</h6>
          </div>
          <div className="notification-header-actions">
            {notifications.length > 0 && (
              <button className="btn-clear-all me-2" onClick={onClearAll} aria-label="Limpiar todas las notificaciones">
                <FaTrashAlt size={14} />
              </button>
            )}
            <button className="btn-close-notification" onClick={onClose} aria-label="Cerrar notificaciones">
              <FaTimes size={16} />
            </button>
          </div>
        </div>

        <div className="notification-body">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              <div className="notification-empty-icon">
                <FaRegBell size={24} />
              </div>
              <p>No tienes notificaciones nuevas</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif._id}
                className={`notification-item ${notif.read ? "" : "unread"}`}
                onClick={() => onMarkRead(notif._id)}
              >
                <div className="notification-content">
                  <p className="notification-message">
                    <span className="client-name">{notif.clienteNombre || notif.clientName}</span>{" "}
                    {formatActionLabels(notif.message.replace(/^([^,]+),/, ""))}
                  </p>
                  <span className="notification-time">{formatDate(notif.createdAt)}</span>
                </div>
                {!notif.read && (
                  <div className="notification-indicator">
                    <span className="unread-dot"></span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="notification-footer">
            <button className="btn-mark-all-read" onClick={onClearAll}>
              <FaCheck size={14} className="me-2" /> Marcar todas como leídas
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default NotificationDropdown
