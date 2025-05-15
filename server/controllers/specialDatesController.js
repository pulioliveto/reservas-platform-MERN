import Business from '../models/Business.js';

// Agregar una o varias fechas especiales de cierre
export const addSpecialClosedDate = async (req, res) => {
  const { fecha, fechas } = req.body;
  try {
    const negocio = await Business.findById(req.params.id);
    if (!negocio) return res.status(404).json({ message: 'Negocio no encontrado' });
    if (!negocio.specialClosedDates) negocio.specialClosedDates = [];

    // Si viene un array de fechas (rango)
    if (Array.isArray(fechas)) {
      fechas.forEach(f => {
        const fDate = new Date(f);
        if (!negocio.specialClosedDates.find(d => new Date(d).toDateString() === fDate.toDateString())) {
          negocio.specialClosedDates.push(fDate);
        }
      });
    }
    // Si viene una sola fecha
    else if (fecha) {
      const fDate = new Date(fecha);
      if (!negocio.specialClosedDates.find(d => new Date(d).toDateString() === fDate.toDateString())) {
        negocio.specialClosedDates.push(fDate);
      }
    }

    await negocio.save();
    res.json(negocio.specialClosedDates);
  } catch (err) {
    res.status(500).json({ message: 'Error al agregar fecha de cierre' });
  }
};

// Quitar una fecha especial de cierre
export const removeSpecialClosedDate = async (req, res) => {
  const { fecha } = req.body;
  try {
    const negocio = await Business.findById(req.params.id);
    if (!negocio) return res.status(404).json({ message: 'Negocio no encontrado' });
    negocio.specialClosedDates = negocio.specialClosedDates.filter(
      d => new Date(d).toDateString() !== new Date(fecha).toDateString()
    );
    await negocio.save();
    res.json(negocio.specialClosedDates);
  } catch (err) {
    res.status(500).json({ message: 'Error al quitar fecha de cierre' });
  }
};