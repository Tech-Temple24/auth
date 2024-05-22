const express = require("express");
const Post = require("../Models/Post");
const auth = require("../middleware/authmiddle");
const allowRoles = require("../middleware/roles");

const router = express.Router();

// Route to create a post
router.post("/", auth, allowRoles("admin", "instructor"), async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPost = new Post({
      title,
      content,
      author: req.user._id,
    });

    await newPost.save();
    res.status(201).send("Post created successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Failed to create post");
  }
});

// Route to update a post
router.put(
  "/:id",
  auth,
  allowRoles("admin", "instructor"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }

      // Check if the user is the author or an admin
      if (
        post.author.toString() !== req.user._id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).send("Access denied");
      }

      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;

      await post.save();
      res.status(200).send("Post updated successfully");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to update post");
    }
  }
);

// Route to delete a post
router.delete(
  "/:id",
  auth,
  allowRoles("admin", "instructor"),
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).send("Post not found");
      }

      // Check if the user is the author or an admin
      if (
        post.author.toString() !== req.user._id &&
        req.user.role !== "admin"
      ) {
        return res.status(403).send("Access denied");
      }

      await post.remove();
      res.status(200).send("Post deleted successfully");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Failed to delete post");
    }
  }
);

module.exports = router;
