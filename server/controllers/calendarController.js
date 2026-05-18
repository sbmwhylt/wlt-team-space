import { google } from "googleapis";

const getCalendarClient = () => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  return google.calendar({ version: "v3", auth });
};

// GET /api/calendar/upcoming
export const getUpcomingEvents = async (req, res) => {
  try {
    const calendar = getCalendarClient();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || [])
      .filter((event) => !!event.hangoutLink)
      .map((event) => ({
        id: event.id,
        title: event.summary || "No title",
        description: event.description || null,
        location: event.location || null,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        isAllDay: !event.start?.dateTime,
        meetLink: event.hangoutLink,
      }));

    res.json({ events });
  } catch (err) {
    console.error("CALENDAR FETCH ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch calendar events" });
  }
};
