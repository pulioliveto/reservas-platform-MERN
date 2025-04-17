import React, { useState, useMemo } from 'react';

const ClientesTab = ({ loadingReservas, errorReservas, reservas }) => {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('desc'); // 'desc' = más recientes primero

  const filteredReservas = useMemo(() => {
    let res = reservas;
    if (search.trim() !== '') {
      const s = search.trim().toLowerCase();
      res = res.filter(r => (r.clienteNombre || '').toLowerCase().includes(s));
    }
    res = [...res].sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
    return res;
  }, [reservas, search, order]);

  const toggleOrder = () => setOrder(order === 'desc' ? 'asc' : 'desc');

  return (
    <div className="w-100">
      <div className="card">
        <div className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
          <h5 className="mb-0">Clientes y Reservas</h5>
          <div className="d-flex gap-2 align-items-center">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ maxWidth: 200 }}
            />
          </div>
        </div>
        <div className="card-body">
          {loadingReservas ? (
            <div>Cargando reservas...</div>
          ) : errorReservas ? (
            <div className="text-danger">{errorReservas}</div>
          ) : filteredReservas.length === 0 ? (
            <div>No hay reservas registradas.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Nombre del Cliente</th>
                    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={toggleOrder}>
                      Fecha{' '}
                      <span style={{ fontSize: '1rem' }}>{order === 'desc' ? '↓' : '↑'}</span>
                    </th>
                    <th>Turno</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservas.map((r) => (
                    <tr key={r._id}>
                      <td>{r.clienteNombre || r.clienteId || '-'}</td>
                      <td>{new Date(r.fecha).toLocaleDateString()}</td>
                      <td>{r.turno}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientesTab;
