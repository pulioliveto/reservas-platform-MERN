const { google } = require('googleapis');

const googleCalendarService = async (accessToken, calendarId) => {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });

  // Crear el cliente de Google Calendar
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Obtener los eventos del calendario
  const events = await calendar.events.list({
    calendarId: calendarId,
    timeMin: (new Date()).toISOString(), // Solo eventos futuros
    maxResults: 10, // Limitar la cantidad de eventos (puedes ajustarlo)
    singleEvents: true,
    orderBy: 'startTime',
  });

  return events.data.items;
};

module.exports = { googleCalendarService };
