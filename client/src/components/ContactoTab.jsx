import { FaFacebook, FaInstagram, FaYoutube, FaGlobe, FaMapMarkerAlt, FaPhone } from "react-icons/fa"
import { parsePhoneNumberFromString } from "libphonenumber-js"
import CountryFlag from "react-country-flag"

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
    <div className="w-100">
      <div className="row">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                Información de contacto
              </h5>

              {business.address && (
                <div className="mb-3">
                  <div className="fw-medium text-muted mb-1">Dirección</div>
                  <div className="d-flex align-items-start">
                    <FaMapMarkerAlt className="me-2 mt-1 text-primary" />
                    <div>{business.address}</div>
                  </div>
                </div>
              )}

              {business.phone && (
                <div className="mb-3">
                  <div className="fw-medium text-muted mb-1">Teléfono</div>
                  <div className="d-flex align-items-center">
                    <FaPhone className="me-2 text-primary" />
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
              )}
            </div>
          </div>
        </div>

        {hasSocialMedia && (
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title fw-bold mb-4 d-flex align-items-center">
                  <FaGlobe className="me-2 text-primary" />
                  Redes sociales y web
                </h5>

                <div className="social-links">
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-card mb-3"
                    >
                      <div className="social-icon website-icon">
                        <FaGlobe size={20} />
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
                      className="social-link-card mb-3"
                    >
                      <div className="social-icon facebook-icon">
                        <FaFacebook size={20} />
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
                      className="social-link-card mb-3"
                    >
                      <div className="social-icon instagram-icon">
                        <FaInstagram size={20} />
                      </div>
                      <div className="social-info">
                        <div className="social-name">Instagram</div>
                        <div className="social-url">{business.instagram}</div>
                      </div>
                    </a>
                  )}

                  {business.youtube && (
                    <a
                      href={business.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-card mb-3"
                    >
                      <div className="social-icon youtube-icon">
                        <FaYoutube size={20} />
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
  )
}

export default ContactoTab
