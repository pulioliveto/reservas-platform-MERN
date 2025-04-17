import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { eliminarReserva } from '../services/apiReservation';

const MisTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const response = await fetch("http://localhost:5000/api/turnos/mis-turnos", {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleCancelar = async (turnoId) => {
    const result = await Swal.fire({
      title: '¿Estás seguro que quieres cancelar el turno?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, volver'
    });
    if (result.isConfirmed) {
      try {
        await eliminarReserva(turnoId);
        setTurnos((prev) => prev.filter((t) => t._id !== turnoId));
        toast.error('Turno cancelado exitosamente');
      } catch (error) {
        toast.error('No se pudo cancelar el turno');
      }
    }
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
                <td>{turno.negocioId?.name || '-'}</td>
                <td>{new Date(turno.fecha).toLocaleDateString()}</td>
                <td>{turno.turno}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancelar(turno._id)}
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
