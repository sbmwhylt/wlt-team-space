import db from "../models/index.js";
import { uploadToImageKit } from "../middleware/upload.js";

const DashboardPost = db.DashboardPost;
const User = db.User;

const VALID_SECTIONS = ["reminders", "team-meeting", "quote-of-the-week", "staff-updates"];

// -------------------- CREATE POST
export const createDashboardPost = async (req, res) => {
  try {
    const { section, title, content } = req.body;

    if (!section || !title || !content) {
      return res.status(400).json({ error: "Section, title and content are required" });
    }

    if (!VALID_SECTIONS.includes(section)) {
      return res.status(400).json({ error: "Invalid section" });
    }

    let imageUrl = null;
    if (req.files?.image) {
      imageUrl = await uploadToImageKit(req.files.image, "/dashboard-posts");
    }

    const author = await User.findByPk(req.user.id, {
      attributes: ["firstName", "lastName"],
    });

    const post = await DashboardPost.create({
      section,
      title,
      content,
      image: imageUrl,
      authorId: req.user.id,
      authorName: `${author.firstName} ${author.lastName}`,
    });

    res.status(201).json({ msg: "Post created successfully", post });
  } catch (err) {
    console.error("CREATE DASHBOARD POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET ALL POSTS (optionally filtered by section)
export const getAllDashboardPosts = async (req, res) => {
  try {
    const where = {};
    if (req.query.section) {
      if (!VALID_SECTIONS.includes(req.query.section)) {
        return res.status(400).json({ error: "Invalid section" });
      }
      where.section = req.query.section;
    }

    const posts = await DashboardPost.findAll({
      where,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["firstName", "lastName"],
        },
      ],
    });

    const formatted = posts.map((p) => {
      const post = p.toJSON();
      if (post.author) {
        post.authorName = `${post.author.firstName} ${post.author.lastName}`;
      }
      delete post.author;
      return post;
    });

    res.json({ posts: formatted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET POST BY ID
export const getDashboardPostById = async (req, res) => {
  try {
    const p = await DashboardPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["firstName", "lastName"],
        },
      ],
    });
    if (!p) return res.status(404).json({ error: "Post not found" });

    const post = p.toJSON();
    if (post.author) {
      post.authorName = `${post.author.firstName} ${post.author.lastName}`;
    }
    delete post.author;

    res.json({ post });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPDATE POST
export const updateDashboardPost = async (req, res) => {
  try {
    const post = await DashboardPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const { title, content } = req.body;

    let imageUrl = post.image;
    if (req.files?.image) {
      imageUrl = await uploadToImageKit(req.files.image, "/dashboard-posts");
    }

    await post.update({
      ...(title && { title }),
      ...(content && { content }),
      image: imageUrl,
    });

    res.json({ msg: "Post updated successfully", post });
  } catch (err) {
    console.error("UPDATE DASHBOARD POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE POST
export const deleteDashboardPost = async (req, res) => {
  try {
    const post = await DashboardPost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    await post.destroy();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
