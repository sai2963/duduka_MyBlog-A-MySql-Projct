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
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Post not found." });
        } else {
          res.status(200).json(results[0]);
        }
      }
    }
  );
});



router.put("/post-list/:id", (req, res) => {
  const postId = req.params.id;
  const { title, summary, comments, author } = req.body;

  if (!postId) {
    return res.status(400).json({ error: "Post ID is required." });
  }

  // Fetch author details
  db.query("SELECT * FROM authors WHERE id = ?", [author], (authorErr, authorResult) => {
    if (authorErr) {
      console.error("Error fetching author details from the database:", authorErr);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if the author exists
    if (authorResult.length === 0) {
      return res.status(400).json({ error: "Author not found." });
    }

    // Update post details
    db.query(
      "UPDATE posts SET Title = ?, Summary = ?, Body = ?, author_id = ? WHERE id = ?",
      [title, summary, comments, author, postId],
      (err, result) => {
        if (err) {
          console.error("Error updating post in the database:", err);
          return res.status(500).json({ error: "Internal Server Error", details: err.message });
        }

        // If the update is successful, you can send a success response or the updated post details.
        res.status(200).json({ message: "Post updated successfully", result });
      }
    );
  });
});
// ... (unchanged code)

router.get("/post-details", (req, res) => {
  const postId = req.query.id;

  if (!postId) {
    res.status(400).json({ error: "Post ID is required." });
    return;
  }

  // Use a JOIN to fetch post details along with author's name
  db.query(
    "SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.id = ?",
    [postId],
    (err, results) => {
      if (err) {
        console.error("Error fetching post details from the database:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: "Post not found." });
        } else {
          res.status(200).json(results[0]);
        }
      }
    }
  );
});

// ... (unchanged code)


module.exports = router;
