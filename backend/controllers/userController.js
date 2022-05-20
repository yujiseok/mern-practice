const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const {use} = require('../routes/userRoutes');

// @desc  Register new user
// @route Post /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fileds');
  }

  // check is user exists
  const userExists = await User.findOne({email});

  if (userExists) {
    res.status(400);
    throw new Error('User alredy exists');
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc  Authenticate a user
// @route Post /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  // check for user email
  const user = await User.findOne({email});

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
  res.json({message: 'Login User'});
});

// @desc  Get user data
// @route Get /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const {_id, name, email} = await User.findById(req.user.id);

  res.status(200).json({id: _id, name, email});
});

// generate jwt
const generateToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
