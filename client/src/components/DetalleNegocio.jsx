import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBusinessById } from '../services/apiBusiness';
import BackButton from './BackButton';
import CalendarioDias from './CalendarioDias';
import GoogleMapReact from 'google-map-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReservaModal from './ReservaModal';

const DetalleNegocio = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const generateSlots = (intervals) => {
    const slots = [];
    intervals.forEach(({ startTime, endTime }) => {
      let [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      while (
        startHour < endHour ||
        (startHour === endHour && startMinute < endMinute)
      ) {
        const nextSlot = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        slots.push(nextSlot);
        startMinute += 30;
        if (startMinute >= 60) {
          startMinute = 0;
          startHour += 1;
        }
      }
    });
    return slots;
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await getBusinessById(id);
        setBusiness(data);
      } catch (error) {
        console.error('Error al obtener el negocio:', error);
      }
    };

    fetchBusiness();
  }, [id]);

  useEffect(() => {
    if (selectedDay && business) {
      const formattedDay = format(selectedDay, 'EEEE', { locale: es });
      const daySchedule = business.schedule?.find(
        (day) => day.day.toLowerCase() === formattedDay.toLowerCase()
      );

      if (daySchedule?.intervals?.length > 0) {
        const slots = generateSlots(daySchedule.intervals);
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [selectedDay, business]);

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSlot(null);
  };

  if (!business) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="container mt-5">
      <BackButton />
      <h2>{business.name}</h2>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#agenda">
            Agenda
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#contacto">
            Contacto
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#ubicacion">
            Dónde nos encontramos
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {/* Pestaña Agenda */}
        <div className="tab-pane fade show active" id="agenda">
          <CalendarioDias onSelectDay={setSelectedDay} />
          {selectedDay && (
            <h3>
              Horarios disponibles para {format(selectedDay, 'dd/MM/yyyy', { locale: es })}
            </h3>
          )}
          <ul>
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <li key={index}>
                  {slot} <button onClick={() => handleSlotSelection(slot)}>Reservar</button>
                </li>
              ))
            ) : (
              <p>No hay turnos disponibles para este día.</p>
            )}
          </ul>
        </div>

        {/* Pestaña Contacto */}
        <div className="tab-pane fade" id="contacto">
          <h3>Contáctanos</h3>
          {business.phone && <p>Teléfono: {business.phone}</p>}
          {business.email && <p>Email: {business.email}</p>}
          {business.website && (
            <p>
              Sitio web:{' '}
              <a href={business.website} target="_blank" rel="noopener noreferrer">
                {business.website}
              </a>
            </p>
          )}
        </div>

        {/* Pestaña Dónde nos encontramos */}
        <div className="tab-pane fade" id="ubicacion">
          <h3>Ubicación</h3>
          {business.address && <p>{business.address}</p>}
          <div style={{ height: '400px', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'TU_API_KEY_DE_GOOGLE_MAPS' }}
              defaultCenter={{
                lat: business.location?.lat || -34.603722,
                lng: business.location?.lng || -58.381592,
              }}
              defaultZoom={14}
            >
              <div
                lat={business.location?.lat || -34.603722}
                lng={business.location?.lng || -58.381592}
              >
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  alt="Ubicación"
                />
              </div>
            </GoogleMapReact>
          </div>
        </div>
      </div>

      {/* Modal de reserva */}
      {showModal && (
  <ReservaModal
    show={showModal}
    onHide={closeModal}
    selectedDay={selectedDay}
    selectedSlot={selectedSlot}
    business={business}
    onConfirm={(slot) => {
      console.log(`Reserva confirmada para el horario: ${slot}`);
      setShowModal(false);
    }}
  />
)}

    </div>
  );
};

export default DetalleNegocio;
