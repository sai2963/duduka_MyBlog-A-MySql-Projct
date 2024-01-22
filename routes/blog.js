const express = require('express');
const router = express.Router();
const db = require('../data/database');

router.get('/create-post', (req, res) => {
  db.query('SELECT * FROM authors', (err, results) => {
    if (err) {  
      console.error('Error fetching authors from the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json(results);
    }
  });
});

router.post('/post-list', (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.comments,
    req.body.author,
  ];

  db.query(
    'INSERT INTO posts (Title, Summary, Body, author_id) VALUES (?, ?, ?, ?)',
    data,
    (err, result) => {
      if (err) {
        console.error('Error inserting post into the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.redirect(`/post-list.html?id=${result.insertId}`);
      }
    }
  );
});

router.get('/post-list', (req, res) => {
  db.query(
    'SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id',
    (err, results) => {
      if (err) {
        console.error('Error fetching posts from the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json(results);
      }
    }
  );
});

router.get('/post-details', (req, res) => {
  const postId = req.query.id;

  if (!postId) {
    res.status(400).json({ error: 'Post ID is required.' });
    return;
  }

  db.query(
    'SELECT posts.*, authors.name AS author_name FROM posts JOIN authors ON posts.author_id = authors.id WHERE posts.id = ?',
    [postId],
    (err, results) => {
      if (err) {
        console.error('Error fetching post details from the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ error: 'Post not found.' });
        } else {
          res.status(200).json(results[0]);
        }
      }
    }
  );
});

router.delete('/post-list/:id', (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    res.status(400).json({ error: 'Post ID is required.' });
    return;
  }

  db.query('DELETE FROM posts WHERE id = ?', [postId], (err, result) => {
    if (err) {
      console.error('Error deleting post from the database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ id: postId });
    }
  });
});

router.put('/post-details', (req, res) => {
  const postId = req.query.id;
  const { title, summary, body, author_name } = req.body;

  if (!postId) {
    res.status(400).json({ error: 'Post ID is required.' });
    return;
  }

  const updateParams = [];
  const queryParams = [];

  if (title !== undefined) {
    updateParams.push('Title = ?');
    queryParams.push(title);
  }

  if (summary !== undefined) {
    updateParams.push('Summary = ?');
    queryParams.push(summary);
  }

  if (body !== undefined) {
    updateParams.push('Body = ?');
    queryParams.push(body);
  }

  if (author_name !== undefined) {
    updateParams.push('author_id = (SELECT id FROM authors WHERE name = ?)');
    queryParams.push(author_name);
  }

  // Ensure there is at least one field to update
  if (updateParams.length === 0) {
    res.status(400).json({ error: 'No fields to update.' });
    return;
  }

  queryParams.push(postId); // Add post ID for WHERE clause

  const updateQuery = `UPDATE posts SET ${updateParams.join(', ')} WHERE id = ?`;

  console.log('Update Query:', updateQuery);
  console.log('Query Params:', queryParams);

  db.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Error updating post in the database:', err);
      res.status(500).json({ error: 'Internal Server Error', details: err.message });
    } else {
      console.log('Update Result:', result);
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Post not found.' });
      } else {
        res.status(200).json({
          id: postId,
          Title: title !== undefined ? title : null,
          Summary: summary !== undefined ? summary : null,
          Body: body !== undefined ? body : null,
          author_name: author_name !== undefined ? author_name : null,
        });
      }
    }
  });
});




module.exports = router;
