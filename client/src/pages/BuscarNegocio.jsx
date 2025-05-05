import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Form, Card, InputGroup, Badge, Spinner } from "react-bootstrap"
import { FaSearch, FaTimes, FaMapMarkerAlt, FaArrowRight, FaStore } from "react-icons/fa"
import BackButton from "../components/BackButton"
import "../css/BuscarNegocio.css"

const BuscarNegocio = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const navigate = useNavigate()

  // Función para manejar la búsqueda
  const searchBusinesses = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/businesses/search?query=${searchQuery}`)
      if (!response.ok) {
        throw new Error("Error en la búsqueda")
      }
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error al buscar negocios:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect para manejar la búsqueda en tiempo real
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchBusinesses(query)
      } else {
        setResults([])
        setHasSearched(false)
      }
    }, 300) // Espera 300ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleSelectBusiness = (id) => {
    navigate(`/negocio/${id}`)
  }

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
    setHasSearched(false)
  }

  // Función para renderizar la imagen del logo con fallback
  const renderLogo = (business) => {
    if (business.logo) {
      return (
        <div className="business-logo">
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/${business.logo.replace("\\", "/")}`}
            alt={`${business.name} logo`}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg?height=60&width=60"
            }}
          />
        </div>
      )
    }
    return (
      <div className="business-logo business-logo-placeholder">
        <FaStore size={24} />
      </div>
    )
  }

  return (
    <div className="search-business-page bg-light py-5 min-vh-100">
      <Container>
        <div className="d-flex align-items-center mb-4">
          <BackButton className="me-3" />
          <h2 className="mb-0 fw-bold text-primary">Buscar Negocio</h2>
        </div>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Body className="p-4">
            <p className="text-muted mb-4">
              Encuentra el negocio donde quieres reservar un turno. Puedes buscar por nombre, tipo de negocio o
              ubicación.
            </p>

            <InputGroup className="search-input-group mb-4">
              <InputGroup.Text className="bg-light border-end-0">
                <FaSearch className="text-primary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre, tipo o ubicación..."
                className="border-start-0 ps-0 py-3 shadow-none"
                aria-label="Buscar negocios"
              />
              {query && (
                <InputGroup.Text className="bg-white border-start-0 pe-3">
                  <button
                    onClick={handleClearSearch}
                    className="btn btn-sm btn-link text-muted p-0"
                    aria-label="Limpiar búsqueda"
                  >
                    <FaTimes />
                  </button>
                </InputGroup.Text>
              )}
            </InputGroup>

            {isLoading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Buscando negocios...</p>
              </div>
            )}

            {!isLoading && hasSearched && results.length === 0 && (
              <div className="text-center py-5">
                <div className="empty-results-icon mb-3">
                  <FaSearch size={48} className="text-muted opacity-25" />
                </div>
                <h5>No se encontraron resultados</h5>
                <p className="text-muted">
                  Intenta con otros términos de búsqueda o verifica que el nombre esté escrito correctamente.
                </p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="search-results animate__animated animate__fadeIn">
                <p className="text-muted mb-3">
                  Se encontraron <strong>{results.length}</strong> resultados
                </p>
                <div className="business-results-list">
                  {results.map((business) => (
                    <Card
                      key={business._id}
                      className="business-card border-0 shadow-sm mb-3"
                      onClick={() => handleSelectBusiness(business._id)}
                    >
                      <Card.Body className="d-flex p-0">
                        <div className="business-logo-container">{renderLogo(business)}</div>
                        <div className="business-info p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h5 className="mb-1 fw-bold">{business.name}</h5>
                              <Badge bg="light" text="dark" className="mb-2">
                                {business.description}
                              </Badge>
                            </div>
                            <FaArrowRight className="text-primary ms-2 mt-1" />
                          </div>
                          {business.address && (
                            <div className="d-flex align-items-center text-muted small mt-2">
                              <FaMapMarkerAlt className="me-1" />
                              <span>{business.address}</span>
                            </div>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && !hasSearched && (
              <div className="text-center py-5">
                <div className="search-prompt-icon mb-3">
                  <FaSearch size={48} className="text-primary opacity-25" />
                </div>
                <h5>Busca tu negocio favorito</h5>
                <p className="text-muted">
                  Escribe el nombre, tipo o ubicación del negocio donde quieres reservar un turno.
                </p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default BuscarNegocio
