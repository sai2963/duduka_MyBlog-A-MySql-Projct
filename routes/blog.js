const express = require("express");
const router = express.Router();
const db = require("../data/database");

router.get("/create-post", (req, res) => {
  db.query("SELECT * FROM authors", (err, results) => {
    if (err) {
      console.error("Error fetching authors from the database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post("/post-list", (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.comments,
    req.body.author,
  ];

  db.query(
    "INSERT INTO posts (Title, Summary, Body, author_id) VALUES (?, ?, ?, ?)",
    data,
    (err, result) => {
      if (err) {
        console.error("Error inserting post into the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.redirect(`/post-list.html?id=${result.insertId}`);
      }
    }
  );
});

router.get("/post-list", (req, res) => {
  db.query(
    "SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id",
    (err, results) => {
      if (err) {
        console.error("Error fetching posts from the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

router.get("/post-details", (req, res) => {
  const postId = req.query.id;

  if (!postId) {
    res.status(400).json({ error: "Post ID is required." });
    return;
  }

  db.query(
    "SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.id = ?",
    [postId],
    (err, results) => {
      if (err) {
        console.error("Error fetching post details from the database:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          return res.status(404).json({ error: "Post not found." });
        } else {
          return res.status(200).json(results[0]);
        }
      }
    }
  );
});

router.put("/post-list/:id", (req, res) => {
  const query = `UPDATE posts SET Title=?,Summary=?,Body=? WHERE id=?`;
  db.query(query, [req.body.title, req.body.summary, req.body.comments,req.params.id]);
});
router.delete("/post-list/:id", (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required." });
  }

  // Delete the post from the database
  db.query("DELETE FROM posts WHERE id = ?", [postId], (err, result) => {
    if (err) {
      console.error("Error deleting post from the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the post was deleted successfully
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Post not found." });
    }

    // If the deletion is successful, send a success response
    res.status(200).json({ message: "Post deleted successfully", id: postId });
  });
});

module.exports = router;
