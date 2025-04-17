import React from 'react';
import { Form, Image } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa';

const LogoPreview = ({ logo, previewUrl, handleLogoChange }) => (
  <>
    <Form.Control
      type="file"
      name="logo"
      onChange={handleLogoChange}
      className="d-none"
      id="logo-upload"
      accept="image/*"
    />
    <div
      className="border border-dashed rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2"
      style={{ width: '150px', height: '150px', cursor: 'pointer', overflow: 'hidden' }}
      onClick={() => document.getElementById('logo-upload').click()}
    >
      {previewUrl ? (
        <Image src={previewUrl} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <>
          <FaUpload size={24} className="text-muted mb-2" />
          <span className="text-muted small">Agregar LOGO</span>
        </>
      )}
    </div>
    {logo && (
      <p className="text-muted small mt-2">
        {logo.name}
      </p>
    )}
  </>
);

export default LogoPreview;
