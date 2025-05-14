"use client"

import { FaBell } from "react-icons/fa"
import "../css/Notification.css"

const NotificationIcon = ({ unreadCount, onClick }) => (
  <div
    className="notification-icon-wrapper"
    onClick={onClick}
    role="button"
    aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ""}`}
  >
    <div className="notification-icon">
      <FaBell />
    </div>
    {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
  </div>
)

export default NotificationIcon
