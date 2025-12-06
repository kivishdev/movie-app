const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Register
router.post('/register', asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please include all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            role: user.role
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            username: user.username,
            role: user.role,
            token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
}));

module.exports = router;