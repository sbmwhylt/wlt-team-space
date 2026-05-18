import { google } from "googleapis";
import http from "http";
import { URL } from "url";
import { exec } from "child_process";

// Paste your OAuth client credentials here before running
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const CLIENT_SECRET = "YOUR_GOOGLE_CLIENT_SECRET";
const REDIRECT_URI = "http://localhost:3001/oauth2callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://www.googleapis.com/auth/calendar.readonly"],
});

console.log("\n✅ Opening browser for Google authorization...\n");

// Open browser
exec(`start "" "${authUrl}"`);

// Temporary local server to catch the redirect
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");

  if (!code) {
    res.end("No code found. Close this and try again.");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    res.end(`
      <html><body style="font-family:sans-serif;padding:2rem">
        <h2>✅ Authorization successful!</h2>
        <p>You can close this tab and go back to your terminal.</p>
      </body></html>
    `);

    console.log("\n========================================");
    console.log("Add these to your server .env file:\n");
    console.log(`GOOGLE_CLIENT_ID=${CLIENT_ID}`);
    console.log(`GOOGLE_CLIENT_SECRET=${CLIENT_SECRET}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log(`GOOGLE_CALENDAR_ID=primary`);
    console.log("========================================\n");
    console.log('Note: GOOGLE_CALENDAR_ID=primary uses your main calendar.');
    console.log('Replace "primary" with a specific calendar ID if needed.\n');
  } catch (err) {
    res.end("Error getting token. Check the terminal.");
    console.error("Token error:", err.message);
  } finally {
    server.close();
  }
});

server.listen(3001, () => {
  console.log("Waiting for Google to redirect back...");
});
