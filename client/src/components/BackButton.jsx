import { useNavigate } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

const BackButton = ({ className = "", label = "Volver" }) => {
  const navigate = useNavigate()

  return (
    <button
      className={`btn btn-back d-inline-flex align-items-center ${className}`}
      onClick={() => navigate(-1)}
      aria-label="Volver a la página anterior"
    >
      <div className="btn-back-icon">
        <FaArrowLeft size={14} />
      </div>
      <span className="btn-back-text">{label}</span>
    </button>
  )
}

export default BackButton
