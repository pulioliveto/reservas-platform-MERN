import { FaBell } from "react-icons/fa"

const NotificationIcon = ({ unreadCount, onClick }) => (
  <div className="notification-icon-wrapper" onClick={onClick}>
    <div className="notification-icon">
      <FaBell />
    </div>
    {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
  </div>
)

export default NotificationIcon
