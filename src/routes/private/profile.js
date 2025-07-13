const express = require('express');

const { userAuth }  = require('./../../middlewares/auth-midddleware');
const User = require('./../../models/user');


const userRouter = express.Router();

userRouter.get('/user', userAuth, async (req, res) => {

  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send('User fetching failed!!!!')
  }
});

userRouter.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const user = req.body;
  console.log('Testing update req body::::', user);

  try {

    const ALLOWED_UPDATES = ["password", "age", "gender", "photoUrl", "about", "skills"];

    const isUpdateAllowed = Object.keys(user).every(key => ALLOWED_UPDATES.includes(key));

    if (!isUpdateAllowed) {
      throw new Error('User update failed!!!!')
    }
    await User.findByIdAndUpdate({ _id: userId }, user, {
      returnDocument: "after",
      runValidators: true
    });
    res.send("User updated successfully !!!!")
  } catch (err) {
    res.status(400).send('User saving failed!!!! ' + err)
  }
});

userRouter.delete('/user', async (req, res) => {

  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId })
    res.send("User Deleted successfully !!!!")
  } catch (err) {
    res.status(400).send('User saving failed!!!!')
  }
});


module.exports = userRouter;