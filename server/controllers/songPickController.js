import db from "../models/index.js";

const SongPick = db.SongPick;
const User = db.User;

// Spotify's oEmbed endpoint is public — no client id, secret or token needed.
const OEMBED_URL = "https://open.spotify.com/oembed";

const isSpotifyUrl = (url) => /^https?:\/\/open\.spotify\.com\//.test(url || "");

// Looks up a pasted Spotify link for its title and cover art.
// Returns an empty object on any failure so a Spotify outage never blocks a save.
const fetchSpotifyDetails = async (url) => {
  if (!isSpotifyUrl(url)) return {};
  try {
    const res = await fetch(`${OEMBED_URL}?url=${encodeURIComponent(url)}`);
    if (!res.ok) return {};
    const data = await res.json();
    return { title: data.title, thumbnail: data.thumbnail_url };
  } catch (err) {
    console.error("SPOTIFY OEMBED ERROR:", err.message);
    return {};
  }
};

// -------------------- CREATE SONG PICK
export const createSongPick = async (req, res) => {
  try {
    const { title, artist, url } = req.body;

    const details = await fetchSpotifyDetails(url);
    const finalTitle = title?.trim() || details.title;

    if (!finalTitle) {
      return res.status(400).json({ error: "Title is required" });
    }

    const author = await User.findByPk(req.user.id, {
      attributes: ["firstName", "lastName"],
    });

    const song = await SongPick.create({
      title: finalTitle,
      artist: artist?.trim() || null,
      url: url?.trim() || null,
      thumbnail: details.thumbnail || null,
      authorId: req.user.id,
      authorName: `${author.firstName} ${author.lastName}`,
    });

    res.status(201).json({ msg: "Song added successfully", song });
  } catch (err) {
    console.error("CREATE SONG PICK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET ALL SONG PICKS
export const getAllSongPicks = async (req, res) => {
  try {
    const picks = await SongPick.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    const songs = picks.map((s) => {
      const song = s.toJSON();
      if (song.author) {
        song.authorName = `${song.author.firstName} ${song.author.lastName}`;
      }
      delete song.author;
      return song;
    });

    res.json({ songs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE SONG PICK (own pick, or admin)
export const deleteSongPick = async (req, res) => {
  try {
    const song = await SongPick.findByPk(req.params.id);
    if (!song) return res.status(404).json({ error: "Song not found" });

    const isAdmin = ["admin", "super-admin"].includes(req.user.role);
    if (song.authorId !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: "You can only remove your own song" });
    }

    await song.destroy();
    res.json({ msg: "Song removed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
