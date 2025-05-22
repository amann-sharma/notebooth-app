require('dotenv').config();
const path = require('path'); //deployement

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.models');
const Note = require('./models/note.model');

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

app.use(express.json()); // Parse JSON requests

// Middleware
app.use(
  cors({
    origin: '*',
  })
);

// Sample Route
app.get('/', (req, res) => {
  res.redirect('/login');
});

//backend ready now integration

//Create Account
app.post('/create-account', async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: 'Full name is required' });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required' });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'Password is required' });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res.json({
      error: true,
      message: 'User already exist',
    });
  }

  const user = new User({
    fullName,
    password,
    email,
  });

  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '36000m',
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: 'Registration Succesfull',
  });
});

//Login Account
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: 'Email is required' });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: 'Password is required' });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '36000m',
    });
    return res.json({
      error: false,
      message: 'Login Successfull',
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: 'Invalid Credentials',
    });
  }
});

//Get User
app.get('/get-user', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: '',
  });
});

//Add note
app.post('/add-note', authenticateToken, async (req, res) => {
  const { title, content, tags, isPinned } = req.body;
  const user = req.user; // No destructuring, access directly

  if (!user) {
    return res.status(401).json({ error: true, message: 'Unauthorized' });
  }

  if (!title) {
    return res.status(400).json({ error: true, message: 'Title is required' });
  }

  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: 'Content is required' });
  }

  try {
    const note = new Note({
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false,
      userId: user.user._id, // Access user._id properly
    });

    await note.save();

    return res.json({
      note,
      message: 'Note added successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

//Edit Note
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !tags) {
    return res.status(400).json({
      error: true,
      message: 'No changes provided',
    });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({
        error: true,
        message: 'Note not found',
      });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned) note.isPinned = isPinned;

    await note.save();
    return res.json({
      error: false,
      note,
      message: 'Note edited successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

//Get All Notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: 'All notes fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

//Delete Note
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(400).json({
        error: true,
        message: 'Note not found',
      });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({
      error: false,
      message: 'Note deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

//Update isPinned status
app.put('/update-note-pinned/:noteId', authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({
        error: true,
        message: 'Note not found',
      });
    }

    note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: 'Note pinned successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

//search api
app.get('/search-notes/', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: 'Search query is required.' });
  }
  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, 'i') } },
        { content: { $regex: new RegExp(query, 'i') } },
      ],
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: 'Notes matching the search query retreived successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'Internal Server Error',
    });
  }
});

//deployement
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start Server
app.listen(8000);

module.exports = app;
