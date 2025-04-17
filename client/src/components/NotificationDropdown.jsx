import React from 'react';

const NotificationDropdown = ({ notifications, onMarkRead, onClearAll }) => (
  <div className="dropdown-menu show p-0" style={{ minWidth: 320, right: 0, left: 'auto', top: '110%', paddingBottom: 0 }}>
    <div className="dropdown-header bg-light fw-bold">Notificaciones</div>
    <div style={{
      maxHeight: notifications.length > 4 ? 400 : 'unset',
      overflowY: notifications.length > 4 ? 'auto' : 'unset',
      paddingBottom: 0
    }}>
      {notifications.length === 0 ? (
        <div className="dropdown-item text-muted">No tienes notificaciones nuevas.</div>
      ) : (
        notifications.map((notif) => (
          <div
            key={notif._id}
            className={`dropdown-item${notif.read ? '' : ' fw-bold'}`}
            style={{ whiteSpace: 'normal', cursor: 'pointer', background: notif.read ? 'white' : '#f8f9fa' }}
            onClick={() => onMarkRead(notif._id)}
          >
            <div>{notif.message}</div>
            <div className="small text-muted mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
    <div style={{ position: 'sticky', bottom: 0, background: 'white', borderTop: '1px solid #dee2e6', zIndex: 2 }}>
      <button className="dropdown-item text-danger text-center" style={{ fontWeight: 'bold' }} onClick={onClearAll}>
        Limpiar todas las notificaciones
      </button>
    </div>
  </div>
);

export default NotificationDropdown;
