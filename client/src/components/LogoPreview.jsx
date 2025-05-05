"use client"
import { Form, Card } from "react-bootstrap"
import { FaUpload, FaImage } from "react-icons/fa"

const LogoPreview = ({ logo, previewUrl, handleLogoChange }) => {
  return (
    <div className="text-center">
      <p className="fw-medium mb-3">Logo del negocio</p>
      <Card className="shadow-sm border mb-3">
        <Card.Body className="p-3">
          <div
            className="d-flex align-items-center justify-content-center bg-light rounded"
            style={{
              height: "180px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {previewUrl ? (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Logo preview"
                className="img-fluid"
                style={{ maxHeight: "180px", maxWidth: "100%" }}
              />
            ) : (
              <div className="text-center text-muted">
                <FaImage size={48} className="mb-2 opacity-50" />
                <p className="small mb-0">Vista previa del logo</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      <div className="d-grid">
        <label
          htmlFor="logo-upload"
          className="btn btn-outline-primary d-flex align-items-center justify-content-center"
        >
          <FaUpload className="me-2" /> {logo ? "Cambiar logo" : "Subir logo"}
        </label>
        <Form.Control
          type="file"
          id="logo-upload"
          name="logo"
          onChange={handleLogoChange}
          accept="image/*"
          className="d-none"
        />
      </div>
      <p className="text-muted small mt-2">Formatos: JPG, PNG o GIF. Tamaño máximo: 2MB</p>
    </div>
  )
}

export default LogoPreview
