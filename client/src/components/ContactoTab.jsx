"use client"

import { FaFacebook, FaInstagram, FaYoutube, FaGlobe, FaMapMarkerAlt, FaPhone, FaInfoCircle } from "react-icons/fa"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import CountryFlag from "react-country-flag"
import "../css/ContactoTab.css"

const ContactoTab = ({ business }) => {
  // Función para formatear el número de teléfono
  const formatPhone = (phone) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone)
      if (phoneNumber) {
        return phoneNumber.formatInternational()
      }
    } catch (e) {}
    return phone
  }

  // Función para obtener el código de país
  const getCountryCode = (phone) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(phone)
      if (phoneNumber && phoneNumber.country) {
        return phoneNumber.country
      }
    } catch (e) {}
    return null
  }

  // Verificar si hay redes sociales
  const hasSocialMedia = business.facebook || business.instagram || business.youtube || business.website

  return (
    <div className="contacto-tab">
      <div className="contacto-header">
        <h5 className="fw-bold d-flex align-items-center">
          <FaInfoCircle className="me-2 text-primary" />
          Información de contacto
        </h5>
      </div>

      <div className="contacto-content">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="contacto-card">
              <div className="contacto-card-header">
                <div className="contacto-card-icon">
                  <FaMapMarkerAlt />
                </div>
                <h6 className="contacto-card-title">Datos de contacto</h6>
              </div>

              <div className="contacto-card-body">
                {business.address && (
                  <div className="contacto-item">
                    <div className="contacto-item-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="contacto-item-content">
                      <div className="contacto-item-label">Dirección</div>
                      <div className="contacto-item-value">{business.address}</div>
                    </div>
                  </div>
                )}

                {business.phone && (
                  <div className="contacto-item">
                    <div className="contacto-item-icon">
                      <FaPhone />
                    </div>
                    <div className="contacto-item-content">
                      <div className="contacto-item-label">Teléfono</div>
                      <div className="contacto-item-value">
                        <div className="d-flex align-items-center">
                          {getCountryCode(business.phone) && (
                            <CountryFlag
                              countryCode={getCountryCode(business.phone)}
                              svg
                              className="me-2"
                              style={{ width: 24, height: 18 }}
                            />
                          )}
                          <span>{formatPhone(business.phone)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!business.address && !business.phone && (
                  <div className="contacto-empty">
                    <p className="text-muted">No hay información de contacto disponible.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {hasSocialMedia && (
            <div className="col-lg-6">
              <div className="contacto-card">
                <div className="contacto-card-header">
                  <div className="contacto-card-icon">
                    <FaGlobe />
                  </div>
                  <h6 className="contacto-card-title">Redes sociales y web</h6>
                </div>

                <div className="contacto-card-body">
                  <div className="social-links">
                    {business.website && (
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="social-link-card">
                        <div className="social-icon website-icon">
                          <FaGlobe />
                        </div>
                        <div className="social-info">
                          <div className="social-name">Sitio web</div>
                          <div className="social-url">{business.website}</div>
                        </div>
                      </a>
                    )}

                    {business.facebook && (
                      <a
                        href={business.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-card"
                      >
                        <div className="social-icon facebook-icon">
                          <FaFacebook />
                        </div>
                        <div className="social-info">
                          <div className="social-name">Facebook</div>
                          <div className="social-url">{business.facebook}</div>
                        </div>
                      </a>
                    )}

                    {business.instagram && (
                      <a
                        href={business.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-card"
                      >
                        <div className="social-icon instagram-icon">
                          <FaInstagram />
                        </div>
                        <div className="social-info">
                          <div className="social-name">Instagram</div>
                          <div className="social-url">{business.instagram}</div>
                        </div>
                      </a>
                    )}

                    {business.youtube && (
                      <a href={business.youtube} target="_blank" rel="noopener noreferrer" className="social-link-card">
                        <div className="social-icon youtube-icon">
                          <FaYoutube />
                        </div>
                        <div className="social-info">
                          <div className="social-name">YouTube</div>
                          <div className="social-url">{business.youtube}</div>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactoTab
