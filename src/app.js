const express = require("express");
const { connectDB } = require("./config/database");
const bcrypt = require('bcrypt');
const User = require('./models/user');
const { Model } = require("mongoose");
const app = express();

app.use(express.json());
app.post('/signup', async (req, res) => {

  const user = new User(req.body);
  const password = req.body.password;

  bcrypt.genSalt()
  try {
    bcrypt.hash(password, 10, function (err, hash) {

    });
    await user.save();
    res.send("User saved successfully !!!!")
  } catch (err) {
    res.status(400).send('User saving failed!!!!  ' + err)
  }
});

app.post('/login', async (req, res) => {
  const emailId = req.body.email;

  try {
    const user = await User.findOne({ email: emailId });

    console.log('User fetched:::::', user);
    res.send("User fetched successfully !!!!")
  } catch (err) {
    res.status(400).send('failed to login user!!!! ' + err)
  }
})

app.get('/user', async (req, res) => {

  const emailId = req.body.email;
  try {
    const user = await User.findOne({ email: emailId });
    res.send(user)
  } catch (err) {
    res.status(400).send('User fetching failed!!!!')
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const user = req.body;
  console.log('Testing update req body::::', user);

  try {
   
    const ALLOWED_UPDATES = [ "password", "age", "gender", "photoUrl", "about", "skills"];

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

app.delete('/user', async (req, res) => {

  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId })
    res.send("User Deleted successfully !!!!")
  } catch (err) {
    res.status(400).send('User saving failed!!!!')
  }
});

connectDB().then(() => {
  console.log('Database connection established successfully!!!!');
  app.listen(3000, () => {
    console.log('Server is successfuly listening on port 3000.....');
  });
}).catch((err) => {
  console.log('Database connection failed !!!!', err)
});

