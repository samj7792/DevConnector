const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

// Bring in the User model
const User = require('../../models/User');

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if the errors var is not empty it will send a 400 status and an array of errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists (unique email)
      let user = await User.findOne({ email });

      // check if a user with the email entered already exists
      if (user) {
        // if the user exists send status error and error array msg
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      console.log('no current user');

      // Get users gravatar
      const avatar = gravatar.url(email, {
        // size
        s: '200',
        // rating
        r: 'pg',
        // default
        d: 'mm'
      });

      console.log('gravatar made');

      user = new User({ name, email, avatar, password });

      console.log('user created');

      // Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10);

      console.log('salt created');

      user.password = await bcrypt.hash(password, salt);

      console.log('password hashed');

      await user.save();

      console.log('user saved');

      // Return jsonwebtoken

      res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
