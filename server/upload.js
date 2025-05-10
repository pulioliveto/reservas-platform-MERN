import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './config/cloudinary.js';

// Configuración de almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'reservas-platform', // Cambia el nombre de la carpeta si querés
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado'), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;