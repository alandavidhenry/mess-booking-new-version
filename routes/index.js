var express = require('express');
const app = require('../../register-test/app');
var router = express.Router();
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
  res.render('index', { title: 'Home' })
});

// GET book-room page
router.get('/book-room', function(req, res, next) {
  res.render('book-room', { title: 'Book a room' })
});

// GET register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' })
});

// POST register page
router.post('/register', async (req, res) => {
  const { password, serviceNumber } = req.body;
  const user = new User({ serviceNumber, password })
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/')
});

// GET login page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log in' })
});

// POST login page
router.post('/login', async (req, res) => {
  const { serviceNumber, password } = req.body;
  const foundUser = await User.findAndValidate(serviceNumber, password);
  if (foundUser) {
      req.session.user_id = foundUser._id;
      res.redirect('/secret');
  }
  else {
      res.redirect('/login')
  }
});

// POST logout page
router.post('/logout', (req, res) => {
  req.session.user_id = null;
  // req.session.destroy();
  res.redirect('/login');
})

// GET secret page
router.get('/secret', requireLogin, (req, res) => {
  res.render('secret', { title: 'Secret' })
})

// GET viewcount page
router.get('/viewcount', (req, res) => {
  if(req.session.count) {
    req.session.count += 1;
  }
  else {
    req.session.count = 1;
  }
  res.send(`Viewed this page ${req.session.count} times.`)
})

module.exports = router;
