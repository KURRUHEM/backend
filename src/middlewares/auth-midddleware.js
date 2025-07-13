const jwt = require('jsonwebtoken');
const User = require('./../models/user');


const userAuth = async (req, res, next) => {
  try {
    const { token } =  req.cookies;

    if (!token) {
      throw new Error("Invalid token !!!");
    }

    const decodedUser = await jwt.verify(token, "DEVTinder@2025");
    const user = await User.findById(decodedUser.id);

    if (!user) {
      throw new Error("Invalid user !!!");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { userAuth };