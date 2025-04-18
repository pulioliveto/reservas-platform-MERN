import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getBusinessById } from '../services/apiBusiness';
import { reservarTurno } from '../services/apiReservation';
import BackButton from '../components/BackButton';
import CalendarioDias from '../components/CalendarioDias';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import ReservaModal from '../components/ReservaModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from "firebase/auth";
import AgendaTab from '../components/AgendaTab';
import ContactoTab from '../components/ContactoTab';
import ClientesTab from '../components/ClientesTab';
import EditarContacto from '../components/EditarContacto';
import { FaPen } from 'react-icons/fa';

const DetalleNegocio = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [errorReservas, setErrorReservas] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('agenda');
  const [editandoContacto, setEditandoContacto] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

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

  // Generar slots según la duración configurada
  const generateSlots = (intervals) => {
    const slots = [];
    const duration = business?.turnoDuration ? Number(business.turnoDuration) : 30; // minutos
    intervals.forEach(({ startTime, endTime }) => {
      let [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      let current = new Date(0, 0, 0, startHour, startMinute);
      const end = new Date(0, 0, 0, endHour, endMinute);
      while (current < end) {
        const timeStr = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
        slots.push({ 
          time: timeStr, 
          available: true,
          startTime: timeStr,
          endTime: '', // No se usa
        });
        current = new Date(current.getTime() + duration * 60000);
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

  // Consultar turnos ocupados para el negocio y fecha seleccionada
  const fetchReservedSlots = useCallback(async (negocioId, fecha) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/${negocioId}?fecha=${fecha}`);
      if (response.ok) {
        const data = await response.json();
        setReservedSlots(data.map(r => r.turno));
      } else {
        setReservedSlots([]);
      }
    } catch (error) {
      setReservedSlots([]);
    }
  }, []);

  // Actualizar slots disponibles y turnos ocupados cuando cambia el día seleccionado
  useEffect(() => {
    if (selectedDay && business) {
      const daySchedule = getDaySchedule(selectedDay);
      if (daySchedule?.intervals?.length > 0) {
        const slots = generateSlots(daySchedule.intervals);
        setAvailableSlots(slots);
        // Consultar turnos ocupados para ese día
        const fechaStr = format(selectedDay, 'yyyy-MM-dd');
        fetchReservedSlots(business._id, fechaStr);
      } else {
        setAvailableSlots([]);
        setReservedSlots([]);
      }
    }
  }, [selectedDay, business, fetchReservedSlots]);

  // Verificar si el usuario autenticado es el creador del negocio
  useEffect(() => {
    const checkOwner = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && business && business.createdBy === user.uid) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    };
    checkOwner();
  }, [business]);

  // Obtener reservas del negocio si es el dueño
  useEffect(() => {
    const fetchReservas = async () => {
      if (!isOwner || !business) return;
      setLoadingReservas(true);
      setErrorReservas("");
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/turnos/${business._id}/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("No se pudieron obtener las reservas");
        const data = await response.json();
        setReservas(data);
      } catch (err) {
        setErrorReservas("Error al cargar las reservas");
      } finally {
        setLoadingReservas(false);
      }
    };
    fetchReservas();
  }, [isOwner, business]);

  // Cambia la pestaña activa según el query param 'tab'
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && (tabParam === 'agenda' || tabParam === 'contacto' || tabParam === 'clientes')) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('agenda');
    }
  }, [location.search, isOwner]);

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
  const handleReservationConfirm = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        toast.error("Debes iniciar sesión para reservar.");
        return;
      }
      await reservarTurno({
        negocioId: business._id,
        clienteId: user.uid,
        turno: selectedSlot.time,
        fecha: format(selectedDay, 'yyyy-MM-dd')
      });

      // Actualizar disponibilidad del slot
      setAvailableSlots(prevSlots =>
        prevSlots.map(s =>
          s.time === selectedSlot.time ? { ...s, available: false } : s
        )
      );
      toast.success('Turno reservado');
      closeModal();
      setTimeout(() => {
        navigate('/mis-turnos');
      }, 1200);
    } catch (error) {
      console.error('Error en la reserva:', error);
      toast.error(error.message || 'Error al realizar la reserva');
    }
  };

  // Guardar cambios de contacto
  const handleSaveContacto = async (formData) => {
    setEditLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/businesses/${business._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: (() => {
          const fd = new FormData();
          Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
          return fd;
        })(),
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');
      const updated = await response.json();
      setBusiness(prev => ({ ...prev, ...updated }));
      setEditandoContacto(false);
      toast.success('Contacto actualizado');
    } catch (err) {
      toast.error('Error al guardar los cambios');
    } finally {
      setEditLoading(false);
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
            {availableSlots.map((slot, index) => {
              const ocupado = reservedSlots.includes(slot.time);
              return (
                <div key={index} className="col d-flex justify-content-center">
                  <button
                    onClick={() => handleSlotSelection(slot)}
                    className={`btn horario-btn w-100 ${!ocupado ? '' : 'btn-outline-secondary disabled'}`}
                    disabled={ocupado}
                    style={{
                      fontSize: '1.2rem',
                      borderRadius: '2rem',
                      padding: '1rem',
                      marginBottom: '0.5rem',
                      background: !ocupado ? 'linear-gradient(90deg, #007bff 60%, #00c6ff 100%)' : '#e9ecef',
                      color: !ocupado ? '#fff' : '#888',
                      border: 'none',
                      boxShadow: !ocupado ? '0 2px 8px rgba(0,0,0,0.07)' : 'none',
                      transition: 'background 0.2s, color 0.2s, transform 0.1s',
                    }}
                    onMouseOver={e => {
                      if (!ocupado) e.currentTarget.style.background = 'linear-gradient(90deg, #0056b3 60%, #00aaff 100%)';
                    }}
                    onMouseOut={e => {
                      if (!ocupado) e.currentTarget.style.background = 'linear-gradient(90deg, #007bff 60%, #00c6ff 100%)';
                    }}
                  >
                    {slot.time}
                    {ocupado && <span className="ms-2 small">(Ocupado)</span>}
                  </button>
                </div>
              );
            })}
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
      <>
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando información del negocio...</p>
        </div>
      </>
    );
  }

  return (
    <div className="container mt-4">
      <BackButton />
      <div className="card shadow-sm mb-4">
        <div className="card-body d-flex flex-column flex-md-row align-items-md-center justify-content-between">
          <div>
            <h2 className="card-title">{business.name}</h2>
            <p className="card-text text-muted">{business.description}</p>
          </div>
          {business.logo && (
            <div className="ms-md-4 mt-3 mt-md-0 text-center">
              <img src={`${process.env.REACT_APP_API_URL}/uploads/${business.logo}`} alt="Logo" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 12, objectFit: 'contain', background: '#fff', border: '1px solid #eee' }} />
            </div>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs" id="negocioTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link${activeTab === 'agenda' ? ' active' : ''}`} 
            id="agenda-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#agenda" 
            type="button" 
            role="tab" 
            aria-controls="agenda" 
            aria-selected={activeTab === 'agenda'}
            onClick={() => setActiveTab('agenda')}
          >
            Agenda
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link${activeTab === 'contacto' ? ' active' : ''}`} 
            id="contacto-tab" 
            data-bs-toggle="tab" 
            data-bs-target="#contacto" 
            type="button" 
            role="tab" 
            aria-controls="contacto" 
            aria-selected={activeTab === 'contacto'}
            onClick={() => setActiveTab('contacto')}
          >
            Contacto
          </button>
        </li>
        {isOwner && (
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link${activeTab === 'clientes' ? ' active' : ''}`}
              id="clientes-tab"
              data-bs-toggle="tab"
              data-bs-target="#clientes"
              type="button"
              role="tab"
              aria-controls="clientes"
              aria-selected={activeTab === 'clientes'}
              onClick={() => setActiveTab('clientes')}
            >
              Clientes
            </button>
          </li>
        )}
      </ul>

      <div className="tab-content p-3 border border-top-0 rounded-bottom w-100" style={{minWidth: 0}}>
        <div className={`tab-pane fade${activeTab === 'agenda' ? ' show active' : ''}`} id="agenda" role="tabpanel" aria-labelledby="agenda-tab">
          <AgendaTab
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            getDaySchedule={getDaySchedule}
            renderDayInfo={renderDayInfo}
          />
        </div>
        <div className={`tab-pane fade${activeTab === 'contacto' ? ' show active' : ''}`} id="contacto" role="tabpanel" aria-labelledby="contacto-tab">
          <div className="d-flex align-items-center justify-content-between mb-2">
            {isOwner && !editandoContacto && (
              <button className="btn btn-link p-0 ms-2" title="Editar" onClick={() => setEditandoContacto(true)}>
                <FaPen />
              </button>
            )}
          </div>
          {isOwner && editandoContacto ? (
            <EditarContacto
              business={business}
              onSave={handleSaveContacto}
              onCancel={() => setEditandoContacto(false)}
              loading={editLoading}
            />
          ) : (
            <ContactoTab business={business} />
          )}
        </div>
        {isOwner && (
          <div className={`tab-pane fade${activeTab === 'clientes' ? ' show active' : ''}`} id="clientes" role="tabpanel" aria-labelledby="clientes-tab">
            <ClientesTab
              loadingReservas={loadingReservas}
              errorReservas={errorReservas}
              reservas={reservas}
            />
          </div>
        )}
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