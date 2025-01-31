// Create web server
// GET /comments => return all comments
// POST /comments => create new comment
// PUT /comments/:id => update a comment
// DELETE /comments/:id => delete a comment

const express = require('express');
const app = express();
const Joi = require('joi');

// Middleware
app.use(express.json());

const comments = [
  { id: 1, comment: 'Comment 1' },
  { id: 2, comment: 'Comment 2' },
  { id: 3, comment: 'Comment 3' }
];

// GET /comments => return all comments
app.get('/comments', (req, res) => {
  res.send(comments);
});

// POST /comments => create new comment
app.post('/comments', (req, res) => {
  const schema = Joi.object({
    comment: Joi.string().min(3).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const comment = {
    id: comments.length + 1,
    comment: req.body.comment
  };
  comments.push(comment);
  res.send(comment);
});

// PUT /comments/:id => update a comment
app.put('/comments/:id', (req, res) => {
  const comment = comments.find(c => c.id === parseInt(req.params.id));
  if (!comment) {
    res.status(404).send('The comment with the given ID was not found');
    return;
  }

  const schema = Joi.object({
    comment: Joi.string().min(3).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  comment.comment = req.body.comment;
  res.send(comment);
});

// DELETE /comments/:id => delete a comment
app.delete('/comments/:id', (req, res) => {
  const comment = comments.find(c => c.id === parseInt(req.params.id));
  if (!comment) {
    res.status(404).send('The comment with the given ID was not found');
    return;
  }

  const index = comments.indexOf(comment);
  comments.splice(index, 1);

  res.send(comment);
});

const port = process.env.PORT ||