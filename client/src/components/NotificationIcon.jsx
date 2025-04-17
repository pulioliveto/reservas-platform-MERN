import React from 'react';

const NotificationIcon = ({ unreadCount, onClick }) => (
  <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>
    <i className="bi bi-bell" style={{ fontSize: '1.7rem', color: '#333' }}></i>
    {unreadCount > 0 && (
      <span style={{
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'red',
        color: 'white',
        borderRadius: '50%',
        fontSize: '0.8rem',
        padding: '2px 6px',
        minWidth: '18px',
        textAlign: 'center',
        fontWeight: 'bold',
        zIndex: 2
      }}>{unreadCount}</span>
    )}
  </div>
);

export default NotificationIcon;
