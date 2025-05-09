"use client"
import { Form, Row, Col, InputGroup } from "react-bootstrap"
import { FaFacebook, FaInstagram, FaYoutube, FaGlobe, FaBuilding, FaMapMarkerAlt, FaTag } from "react-icons/fa"
import PhoneInputWhatsApp from "./PhoneInputWhatsApp"

const BusinessForm = ({ formData, handleChange, handlePhoneChange }) => (
  <div className="business-form">
    <Form.Group className="mb-4">
      <InputGroup>
        <InputGroup.Text className="bg-light border-end-0">
          <FaBuilding className="text-primary" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre del negocio"
          required
          className="border-start-0 ps-0"
        />
      </InputGroup>
      <Form.Text className="text-muted">El nombre que verán tus clientes al buscar tu negocio</Form.Text>
    </Form.Group>

    <Form.Group className="mb-4">
      <InputGroup>
        <InputGroup.Text className="bg-light border-end-0">
          <FaTag className="text-primary" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Tipo de Negocio"
          required
          className="border-start-0 ps-0"
        />
      </InputGroup>
      <Form.Text className="text-muted">
        Por ejemplo: Peluquería, Consultorio médico, Estudio de tatuajes, etc.
      </Form.Text>
    </Form.Group>

    <Form.Group className="mb-4">
      <InputGroup>
        <InputGroup.Text className="bg-light border-end-0">
          <FaMapMarkerAlt className="text-primary" />
        </InputGroup.Text>
        <Form.Control
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Dirección"
          required
          className="border-start-0 ps-0"
        />
      </InputGroup>
      <Form.Text className="text-muted">Dirección física donde se encuentra tu negocio</Form.Text>
    </Form.Group>

    <Form.Group className="mb-4">
      <Form.Label className="fw-medium">Teléfono de contacto</Form.Label>
      <Form.Control
        type="tel"
        name="phone"
        value={formData.phone || ""}
        onChange={handleChange}
        placeholder="Ej: +54 9 343 1234567"
        required
      />
      <Form.Text className="text-muted">
        Este número se usará para contacto y notificaciones por WhatsApp
      </Form.Text>
    </Form.Group>

    <hr className="my-4" />

    <h6 className="fw-bold mb-3">Redes sociales (opcionales)</h6>

    <Row className="g-3">
      <Col md={6}>
        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text className="bg-light border-end-0">
              <FaFacebook className="text-primary" />
            </InputGroup.Text>
            <Form.Control
              type="url"
              name="facebook"
              value={formData.facebook || ""}
              onChange={handleChange}
              placeholder="Facebook"
              autoComplete="off"
              className="border-start-0 ps-0"
            />
          </InputGroup>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text className="bg-light border-end-0">
              <FaInstagram style={{ color: "#E1306C" }} />
            </InputGroup.Text>
            <Form.Control
              type="url"
              name="instagram"
              value={formData.instagram || ""}
              onChange={handleChange}
              placeholder="Instagram"
              autoComplete="off"
              className="border-start-0 ps-0"
            />
          </InputGroup>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text className="bg-light border-end-0">
              <FaYoutube style={{ color: "#FF0000" }} />
            </InputGroup.Text>
            <Form.Control
              type="url"
              name="youtube"
              value={formData.youtube || ""}
              onChange={handleChange}
              placeholder="YouTube"
              autoComplete="off"
              className="border-start-0 ps-0"
            />
          </InputGroup>
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group className="mb-3">
          <InputGroup>
            <InputGroup.Text className="bg-light border-end-0">
              <FaGlobe className="text-success" />
            </InputGroup.Text>
            <Form.Control
              type="url"
              name="website"
              value={formData.website || ""}
              onChange={handleChange}
              placeholder="Sitio Web"
              autoComplete="off"
              className="border-start-0 ps-0"
            />
          </InputGroup>
        </Form.Group>
      </Col>
    </Row>

    <hr className="my-4" />

    <Form.Group className="mb-3">
      <Form.Label className="fw-medium">Duración de cada turno</Form.Label>
      <Form.Select
        name="turnoDuration"
        value={formData.turnoDuration}
        onChange={handleChange}
        required
        className="shadow-sm"
      >
        <option value={15}>15 minutos</option>
        <option value={30}>30 minutos</option>
        <option value={45}>45 minutos</option>
        <option value={60}>60 minutos (1 hora)</option>
        <option value={90}>90 minutos (1.5 horas)</option>
        <option value={120}>120 minutos (2 horas)</option>
      </Form.Select>
      <Form.Text className="text-muted">Este será el tiempo predeterminado para cada reserva</Form.Text>
    </Form.Group>
  </div>
)

export default BusinessForm
