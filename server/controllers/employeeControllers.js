import Employee from '../models/Employee.js';

// Obtener empleados de un negocio
export const getEmployees = async (req, res) => {
  try {
    const { negocioId } = req.params;
    const empleados = await Employee.find({ negocioId });
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleados', error: error.message });
  }
};

// Agregar un empleado
export const addEmployee = async (req, res) => {
  try {
    const { negocioId, nombre, email, telefono } = req.body;
    if (!negocioId || !nombre) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }
    const nuevoEmpleado = new Employee({ negocioId, nombre, email, telefono });
    await nuevoEmpleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar empleado', error: error.message });
  }
};

// Eliminar un empleado
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empleado', error: error.message });
  }
};