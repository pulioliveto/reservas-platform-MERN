import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaGlobe } from 'react-icons/fa';
import 'react-phone-input-2/lib/bootstrap.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import CountryFlag from 'react-country-flag';

const ContactoTab = ({ business }) => (
  <div className="w-100">
    <div className="row m-0">
      <div className="col-md-6 p-0">
        <h4 className="mb-3">Información de contacto</h4>
        <ul className="list-group">
          {business.address && (
            <li className="list-group-item">
              <strong>Dirección:</strong> {business.address}
            </li>
          )}
          {business.phone && (
            <li className="list-group-item d-flex align-items-center">
              <strong className="me-2">Teléfono:</strong>
              {(() => {
                let countryCode = '';
                try {
                  const phoneNumber = parsePhoneNumberFromString(business.phone);
                  if (phoneNumber && phoneNumber.country) {
                    countryCode = phoneNumber.country;
                  }
                } catch (e) {}
                return countryCode ? (
                  <span className="me-2">
                    <CountryFlag countryCode={countryCode} svg style={{ width: 24, height: 18 }} />
                  </span>
                ) : null;
              })()}
              <span>{business.phone}</span>
            </li>
          )}
          {business.facebook && (
            <li className="list-group-item d-flex align-items-center">
              <FaFacebook className="me-2 text-primary" size={20} />
              <a href={business.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            </li>
          )}
          {business.instagram && (
            <li className="list-group-item d-flex align-items-center">
              <FaInstagram className="me-2 text-danger" size={20} />
              <a href={business.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </li>
          )}
          {business.youtube && (
            <li className="list-group-item d-flex align-items-center">
              <FaYoutube className="me-2 text-danger" size={20} />
              <a href={business.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
            </li>
          )}
          {business.website && (
            <li className="list-group-item d-flex align-items-center">
              <FaGlobe className="me-2 text-success" size={20} />
              <a href={business.website} target="_blank" rel="noopener noreferrer">Sitio web</a>
            </li>
          )}
        </ul>
      </div>
    </div>
  </div>
);

export default ContactoTab;
