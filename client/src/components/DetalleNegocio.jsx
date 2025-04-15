import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinessById } from '../services/apiBusiness';
import { reservarTurno } from '../services/apiReservation';
import BackButton from './BackButton';
import CalendarioDias from './CalendarioDias';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import ReservaModal from './ReservaModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetalleNegocio = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Mapeo de días con todas las variantes posibles
  const DAYS_MAP = [
    { id: 0, names: ['domingo'] },
    { id: 1, names: ['lunes'] },
    { id: 2, names: ['martes'] },
    { id: 3, names: ['miércoles', 'miercoles'] },
    { id: 4, names: ['jueves'] },
    { id: 5, names: ['viernes'] },
    { id: 6, names: ['sábado', 'sabado'] }
  ];

  // Normalizar nombres de días para comparación
  const normalizeDayName = (dayName) => {
    return dayName.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace('á', 'a')
      .replace('é', 'e')
      .replace('í', 'i')
      .replace('ó', 'o')
      .replace('ú', 'u');
  };

  // Generar slots de 30 minutos
  const generateSlots = (intervals) => {
    const slots = [];
    intervals.forEach(({ startTime, endTime }) => {
      let [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
        const timeStr = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        slots.push({ 
          time: timeStr, 
          available: true,
          startTime: timeStr,
          endTime: `${String(startHour).padStart(2, '0')}:${String((startMinute + 30) % 60).padStart(2, '0')}`
        });
        
        startMinute += 30;
        if (startMinute >= 60) {
          startMinute = 0;
          startHour += 1;
        }
      }
    });
    return slots;
  };

  // Obtener el horario para un día específico
  const getDaySchedule = (date) => {
    if (!business?.schedule) return null;
    
    const dayOfWeek = date.getDay();
    const dayInfo = DAYS_MAP.find(d => d.id === dayOfWeek);
    if (!dayInfo) return null;

    return business.schedule.find(item => {
      const storedDay = normalizeDayName(item.day);
      return dayInfo.names.some(name => normalizeDayName(name) === storedDay);
    });
  };

  // Cargar datos del negocio
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await getBusinessById(id);
        console.log('Datos del negocio recibidos:', data);
        setBusiness(data);
        
        // Seleccionar automáticamente el primer día abierto
        const today = new Date();
        let dayToSelect = today;
        let attempts = 0;
        
        while (attempts < 7) {
          const schedule = getDaySchedule(dayToSelect);
          if (schedule?.intervals?.length > 0) {
            setSelectedDay(dayToSelect);
            break;
          }
          dayToSelect = addDays(dayToSelect, 1);
          attempts++;
        }
      } catch (error) {
        console.error('Error al obtener el negocio:', error);
        toast.error('Error al cargar los datos del negocio');
      }
    };

    fetchBusiness();
  }, [id]);

  // Actualizar slots disponibles cuando cambia el día seleccionado
  useEffect(() => {
    if (selectedDay && business) {
      const daySchedule = getDaySchedule(selectedDay);
      
      if (daySchedule?.intervals?.length > 0) {
        const slots = generateSlots(daySchedule.intervals);
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [selectedDay, business]);

  // Manejar selección de slot
  const handleSlotSelection = (slot) => {
    if (!slot.available) {
      toast.error('Este turno ya está reservado');
      return;
    }
    setSelectedSlot(slot);
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  // Confirmar reserva
  const handleReservationConfirm = async (reservationData) => {
    try {
      await reservarTurno({
        negocioId: business._id,
        fecha: format(selectedDay, 'yyyy-MM-dd'),
        turno: selectedSlot.time,
        cliente: reservationData.cliente,
        telefono: reservationData.telefono,
        email: reservationData.email
      });

      // Actualizar disponibilidad del slot
      setAvailableSlots(prevSlots =>
        prevSlots.map(s =>
          s.time === selectedSlot.time ? { ...s, available: false } : s
        )
      );
      
      toast.success('Reserva confirmada exitosamente');
      closeModal();
    } catch (error) {
      console.error('Error en la reserva:', error);
      toast.error(error.message || 'Error al realizar la reserva');
    }
  };

  // Renderizar información del día
  const renderDayInfo = () => {
    if (!selectedDay || !business) return null;
    
    const daySchedule = getDaySchedule(selectedDay);
    const isClosed = !daySchedule?.intervals?.length;
    const dayName = format(selectedDay, 'EEEE', { locale: es });

    if (isClosed) {
      return (
        <div className="alert alert-warning mt-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>¡CERRADO!</strong> El negocio no abre los {dayName}.
        </div>
      );
    }

    return (
      <>
        <h4 className="mt-3 mb-3">
          Horarios disponibles para {dayName} {format(selectedDay, 'dd/MM/yyyy', { locale: es })}
        </h4>
        {availableSlots.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {availableSlots.map((slot, index) => (
              <div key={index} className="col">
                <button
                  onClick={() => handleSlotSelection(slot)}
                  className={`btn w-100 ${slot.available ? 'btn-primary' : 'btn-outline-secondary'}`}
                  disabled={!slot.available}
                >
                  {slot.time}
                  {!slot.available && <span className="ms-2 small">(Ocupado)</span>}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            No hay turnos disponibles para este día.
          </div>
        )}
      </>
    );
  };

  if (!business) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando información del negocio...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <BackButton />
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title">{business.name}</h2>
          <p className="card-text text-muted">{business.description}</p>
        </div>
      </div>

      <ul className="nav nav-tabs" id="negocioTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link active" 
            id="agenda-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#agenda" 
            type="button" 
            role="tab" 
            aria-controls="agenda" 
            aria-selected="true"
          >
            Agenda
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className="nav-link" 
            id="contacto-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#contacto" 
            type="button" 
            role="tab" 
            aria-controls="contacto" 
            aria-selected="false"
          >
            Contacto
          </button>
        </li>
      </ul>

      <div className="tab-content p-3 border border-top-0 rounded-bottom">
        <div className="tab-pane fade show active" id="agenda" role="tabpanel" aria-labelledby="agenda-tab">
          <div className="mb-4">
            <CalendarioDias 
              onSelectDay={setSelectedDay}
              tileDisabled={({ date }) => {
                const daySchedule = getDaySchedule(date);
                return !daySchedule?.intervals?.length;
              }}
              tileClassName={({ date }) => {
                const daySchedule = getDaySchedule(date);
                return !daySchedule?.intervals?.length ? 'text-muted bg-light' : '';
              }}
              initialDate={selectedDay}
            />
          </div>
          {renderDayInfo()}
        </div>

        <div className="tab-pane fade" id="contacto" role="tabpanel" aria-labelledby="contacto-tab">
          <div className="row">
            <div className="col-md-6">
              <h4 className="mb-3">Información de contacto</h4>
              <ul className="list-group">
                {business.address && (
                  <li className="list-group-item">
                    <strong>Dirección:</strong> {business.address}
                  </li>
                )}
                {business.phone && (
                  <li className="list-group-item">
                    <strong>Teléfono:</strong> {business.phone}
                  </li>
                )}
                {business.email && (
                  <li className="list-group-item">
                    <strong>Email:</strong> {business.email}
                  </li>
                )}
                {business.website && (
                  <li className="list-group-item">
                    <strong>Sitio web:</strong> 
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="ms-2">
                      {business.website}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ReservaModal
          show={showModal}
          onHide={closeModal}
          selectedDay={selectedDay}
          selectedSlot={selectedSlot}
          business={business}
          onConfirm={handleReservationConfirm}
        />
      )}
    </div>
  );
};

export default DetalleNegocio;