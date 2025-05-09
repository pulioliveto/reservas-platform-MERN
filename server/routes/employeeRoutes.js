import express from 'express';
import { auth } from '../middleware/firebaseAuth.js';
import { getEmployees, addEmployee, deleteEmployee } from '../controllers/employeeControllers.js';

const router = express.Router();
 
router.get('/:negocioId', auth, getEmployees); // Obtener empleados de un negocio
router.post('/', auth, addEmployee); // Agregar un empleado
router.delete('/:id', auth, deleteEmployee); // Eliminar un empleado

export default router;