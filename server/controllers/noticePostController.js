import db from "../models/index.js";
import { uploadToImageKit } from "../middleware/upload.js";

const NoticePost = db.NoticePost;
const User = db.User;

// -------------------- CREATE POST
export const createNoticePost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    let imageUrl = null;
    if (req.files?.image) {
      imageUrl = await uploadToImageKit(req.files.image, "/notice-board");
    }

    const author = await User.findByPk(req.user.id, {
      attributes: ["firstName", "lastName"],
    });

    const post = await NoticePost.create({
      title,
      content,
      image: imageUrl,
      authorId: req.user.id,
      authorName: `${author.firstName} ${author.lastName}`,
    });

    res.status(201).json({ msg: "Post created successfully", post });
  } catch (err) {
    console.error("CREATE NOTICE POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET ALL POSTS
export const getAllNoticePosts = async (req, res) => {
  try {
    const posts = await NoticePost.findAll({
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
export const getNoticePostById = async (req, res) => {
  try {
    const p = await NoticePost.findByPk(req.params.id, {
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
export const updateNoticePost = async (req, res) => {
  try {
    const post = await NoticePost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const { title, content } = req.body;

    let imageUrl = post.image;
    if (req.files?.image) {
      imageUrl = await uploadToImageKit(req.files.image, "/notice-board");
    }

    await post.update({
      ...(title && { title }),
      ...(content && { content }),
      image: imageUrl,
    });

    res.json({ msg: "Post updated successfully", post });
  } catch (err) {
    console.error("UPDATE NOTICE POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DELETE POST
export const deleteNoticePost = async (req, res) => {
  try {
    const post = await NoticePost.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    await post.destroy();
    res.json({ msg: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
