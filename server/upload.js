import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Guarda en la carpeta `uploads`
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre del archivo con marca de tiempo
  }
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/jpg'|| file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no soportado'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
    
// Exportar upload para usar en las rutas
export default upload;