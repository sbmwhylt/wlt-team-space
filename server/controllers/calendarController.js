import { google } from "googleapis";

const getCalendarClient = () => {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  return google.calendar({ version: "v3", auth });
};

// GET /api/calendar/upcoming
export const getUpcomingEvents = async (req, res) => {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []).map((event) => ({
      id: event.id,
      title: event.summary || "No title",
      description: event.description || null,
      location: event.location || null,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      isAllDay: !event.start?.dateTime,
      meetLink: event.hangoutLink || null,
    }));

    res.json({ events });
  } catch (err) {
    console.error("CALENDAR FETCH ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};
