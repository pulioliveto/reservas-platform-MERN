import { useState } from "react"
import { Form, Button, InputGroup, Spinner } from "react-bootstrap"
import PhoneInputWhatsApp from "./PhoneInputWhatsApp"
import { FaFacebook, FaInstagram, FaYoutube, FaGlobe, FaMapMarkerAlt, FaSave, FaTimes } from "react-icons/fa"

const EditarContacto = ({ business, onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    phone: business.phone ?? "",
    facebook: business.facebook ?? "",
    instagram: business.instagram ?? "",
    youtube: business.youtube ?? "",
    website: business.website ?? "",
    address: business.address ?? "",
    logo: null, // Para el nuevo archivo
  })
  const [saving, setSaving] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (phone) => {
    setFormData((prev) => ({ ...prev, phone }))
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    await onSave(formData)
    setSaving(false)
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h5 className="card-title fw-bold mb-4">Editar información de contacto</h5>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Dirección</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaMapMarkerAlt className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Dirección del negocio"
                required
                className="border-start-0 ps-0"
              />
            </InputGroup>
            <Form.Text className="text-muted">Dirección física donde se encuentra tu negocio</Form.Text>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Teléfono</Form.Label>
            <PhoneInputWhatsApp value={formData.phone} onChange={handlePhoneChange} />
            <Form.Text className="text-muted">Este número se usará para contacto y notificaciones</Form.Text>
          </Form.Group>

          <hr className="my-4" />
          <h6 className="fw-bold mb-3">Redes sociales (opcionales)</h6>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaFacebook className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Link a Facebook"
                autoComplete="off"
                className="border-start-0 ps-0"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaInstagram style={{ color: "#E1306C" }} />
              </InputGroup.Text>
              <Form.Control
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Link a Instagram"
                autoComplete="off"
                className="border-start-0 ps-0"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaYoutube style={{ color: "#FF0000" }} />
              </InputGroup.Text>
              <Form.Control
                type="url"
                name="youtube"
                value={formData.youtube}
                onChange={handleChange}
                placeholder="Link a YouTube"
                autoComplete="off"
                className="border-start-0 ps-0"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4">
            <InputGroup>
              <InputGroup.Text className="bg-light border-end-0">
                <FaGlobe className="text-success" />
              </InputGroup.Text>
              <Form.Control
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="Sitio Web"
                autoComplete="off"
                className="border-start-0 ps-0"
              />
            </InputGroup>
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="outline-secondary"
              onClick={onCancel}
              disabled={saving || loading}
              className="d-flex align-items-center"
            >
              <FaTimes className="me-2" /> Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving || loading} className="d-flex align-items-center">
              {saving || loading ? <Spinner size="sm" /> : <><FaSave className="me-2" /> Guardar cambios</>}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default EditarContacto
