const express = require('express');
const bcrypt = require('bcrypt');

const User = require('./../models/user');
const { signupDataValidator } = require('./../utils/validations');


const authRouter = express.Router();


/**
 * Sign up API
 */
authRouter.post('/signup', async (req, res) => {

  const { firstName, lastName, email, password, age, gender } = req.body;

  try {
    signupDataValidator(req);
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
      gender
    });

    await user.save();
    res.send("User saved successfully !!!!")
  } catch (err) {
    res.status(400).send('ERROR:::' + err)
  }
});

/**
 * Login API
 */
authRouter.post('/login', async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      res.status(400).send('Invalid credentails !!!');
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      res.status(400).send('Invalid credentails !!!');
    }

    const token = await user.getJWT()
    console.log('Token generated::::', token);

    res.cookie("token", token)
    res.send("User Logged in successfully !!!!");
  } catch (err) {
    res.status(400).send('Failed to login user!!!! ' + err);
  }
});

module.exports = authRouter;