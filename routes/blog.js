// routes/blog.js
const express = require('express');
const router = express.Router();
const db = require('../data/database');



// Define your routes and middleware here
// routes/blog.js
router.get('/create-post', (req, res) => {
    db.query('SELECT * FROM authors', (err, results) => {
        if (err) {
            console.error('Error fetching authors from the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Send JSON response with authors data
            res.status(200).json(results);
        }
    });
});

// routes/blog.js
router.post('/post-list', (req, res) => {
    const data = [
        req.body.title,
        req.body.summary,
        req.body.comments,
        req.body.author
    ];

    db.query('INSERT INTO posts (Title, Summary, Body, author_id) VALUES (?, ?, ?, ?)', data, (err, result) => {
        if (err) {
            console.error('Error inserting post into the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Redirect to post-list.html with the inserted post ID
            res.redirect(`/post-list.html?id=${result.insertId}`);
        }
    });
});

// routes/blog.js
// routes/blog.js
router.get('/post-list', (req, res) => {
    db.query('SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id', (err, results) => {
        if (err) {
            console.error('Error fetching posts from the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            // Send JSON response with posts data
            res.status(200).json(results);
        }
    });
});
// routes/blog.js
router.get('/post-details', (req, res) => {
    const postId = req.query.id; // Extract post ID from query parameter

    if (!postId) {
        res.status(400).json({ error: 'Post ID is required.' });
        return;
    }

    db.query('SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.id = ?', [postId], (err, results) => {
        if (err) {
            console.error('Error fetching post details from the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: 'Post not found.' });
            } else {
                // Send JSON response with post details
                res.status(200).json(results[0]);
            }
        }
    });
});



module.exports = router;
