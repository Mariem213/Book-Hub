const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Load environment variables
require('dotenv').config();

// Signup route
router.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
      // Check if user already exists with the same email or username
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
          return res.status(400).json({ msg: 'User with this email or username already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user with username
      user = new User({ name, username, email, password: hashedPassword });
      await user.save();

      // Create and sign a JWT
      const payload = { userId: user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Respond with 201 status and the token
      res.status(201).json({ token, message: 'User registered successfully' });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create and sign a JWT
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
