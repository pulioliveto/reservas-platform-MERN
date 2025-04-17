import { googleCalendarService } from '../googleCalendarService.js';

const callendarControllers = async (req, res) => {
  const { accessToken, calendarId } = req.body;

  if (!accessToken || !calendarId) {
    return res.status(400).send('Access token and calendar ID are required');
  }

  try {
    const events = await googleCalendarService(accessToken, calendarId);
    res.json(events);
  } catch (error) {
    console.error('Error al acceder a Google Calendar:', error);
    res.status(500).send('Error al acceder a Google Calendar');
  }
};

export { callendarControllers };

