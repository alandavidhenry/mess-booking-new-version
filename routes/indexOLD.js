var express = require('express');
var router = express.Router();
const session = require('express-session');
const User = require('../models/user');

// AUTHENTICATION MIDDLEWARE
const requireLogin = (req, res, next) => {
  if (!req.session.user_id) {
      res.redirect('/login')
  }
  next();
}

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// GET book-room page
router.get('/book-room', function(req, res, next) {
  res.render('book-room', { title: 'Book a room' });
  console.log('123');
});

// GET register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// POST register page
router.post('/register', async (req, res) => {
  const { password, serviceNumber, rank, firstName, lastName, unit, contactNumber, emailAddress } = req.body;
  const user = new User({ serviceNumber, rank, firstName, lastName, unit, contactNumber, emailAddress, password })
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/');
});

// GET log in page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log in' });
});

// POST login page
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
      req.session.user_id = foundUser._id;
      res.redirect('/secret');
  }
  else {
      res.redirect('/login');
  }
});

// GET bookings page
router.get('/bookings', function(req, res, next) {
  res.render('bookings', { title: 'Bookings' });
});

module.exports = router;
