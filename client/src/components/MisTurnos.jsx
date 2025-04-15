import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Simula la carga de turnos desde un backend
    const fetchTurnos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/turnos/mis-turnos", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Token del usuario autenticado
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTurnos(data);
        } else {
          console.error("Error al cargar los turnos");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchTurnos();
  }, []);

  const handleVolver = () => {
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Mis Turnos</h1>
      {turnos.length > 0 ? (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Negocio</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno, index) => (
              <tr key={turno._id}>
                <td>{index + 1}</td>
                <td>{turno.negocio.nombre}</td>
                <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                <td>{turno.hora}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => console.log(`Cancelar turno: ${turno._id}`)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info text-center">
          No tienes turnos reservados aún.
        </div>
      )}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleVolver}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default MisTurnos;
