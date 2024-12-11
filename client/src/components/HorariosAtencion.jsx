import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { InfoCircle, Plus, Trash } from 'react-bootstrap-icons';

const HorariosAtencion = ({ onHorariosChange }) => {
  const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const [horarios, setHorarios] = useState(
    diasSemana.map((_, index) => ({
      activo: index !== 6, // Domingo (índice 6) inactivo por defecto
      rangos: [{ inicio: "07:00", fin: "21:00" }],
    }))
  );

  const handleHorarioChange = (diaIndex, rangoIndex, field, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[diaIndex].rangos[rangoIndex][field] = value;
    setHorarios(nuevosHorarios);
    onHorariosChange(nuevosHorarios);
  };

  const toggleDia = (diaIndex) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[diaIndex].activo = !nuevosHorarios[diaIndex].activo;

    // Si se desactiva el día, eliminar todos los rangos de horarios
    if (!nuevosHorarios[diaIndex].activo) {
      nuevosHorarios[diaIndex].rangos = [{ inicio: "07:00", fin: "21:00" }];
    }

    setHorarios(nuevosHorarios);
    onHorariosChange(nuevosHorarios);
  };

  const agregarRango = (diaIndex) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[diaIndex].rangos.push({ inicio: "07:00", fin: "21:00" });
    setHorarios(nuevosHorarios);
    onHorariosChange(nuevosHorarios);
  };

  const eliminarRango = (diaIndex, rangoIndex) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[diaIndex].rangos.splice(rangoIndex, 1);

    // Si no quedan rangos, agregar uno por defecto
    if (nuevosHorarios[diaIndex].rangos.length === 0) {
      nuevosHorarios[diaIndex].rangos.push({ inicio: "07:00", fin: "21:00" });
    }

    setHorarios(nuevosHorarios);
    onHorariosChange(nuevosHorarios);
  };

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center gap-2 mb-3">
        <h5 className="m-0">Horarios de atención</h5>
        <InfoCircle className="text-muted" />
      </div>
      <Row className="g-3">
        {diasSemana.map((dia, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <div className="d-flex align-items-center mb-2">
              <Form.Check
                type="checkbox"
                id={`dia-${index}`}
                checked={horarios[index].activo}
                onChange={() => toggleDia(index)}
                label={dia}
                className="me-2"
              />
            </div>
            {horarios[index].activo &&
              horarios[index].rangos.map((rango, rangoIndex) => (
                <div key={rangoIndex} className="d-flex align-items-center mb-2">
                  <Form.Select
                    size="sm"
                    value={rango.inicio}
                    onChange={(e) =>
                      handleHorarioChange(index, rangoIndex, "inicio", e.target.value)
                    }
                    className="me-2"
                    style={{ width: "auto" }}
                  >
                    {[...Array(24)].map((_, hour) => (
                      <option
                        key={hour}
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </option>
                    ))}
                  </Form.Select>
                  <span className="me-2">-</span>
                  <Form.Select
                    size="sm"
                    value={rango.fin}
                    onChange={(e) =>
                      handleHorarioChange(index, rangoIndex, "fin", e.target.value)
                    }
                    style={{ width: "auto" }}
                  >
                    {[...Array(24)].map((_, hour) => (
                      <option
                        key={hour}
                        value={`${hour.toString().padStart(2, "0")}:00`}
                      >
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 ms-2 text-danger"
                    onClick={() => eliminarRango(index, rangoIndex)}
                  >
                    <Trash />
                  </Button>
                  {rangoIndex === horarios[index].rangos.length - 1 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 ms-2 text-primary"
                      onClick={() => agregarRango(index)}
                    >
                      <Plus />
                    </Button>
                  )}
                </div>
              ))}
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HorariosAtencion;
