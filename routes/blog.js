// routes/blog.js
const express = require('express');
const router = express.Router();
const db = require('../data/database');

router.get('/posts', (req, res) => {
    res.render('posts-list');
});

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


module.exports = router;
