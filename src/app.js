const express = require("express");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/database");


const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/public');
const userRouter = require('./routes/private/profile');


app.use('/', authRouter);
app.use('/', userRouter);

connectDB().then(() => {
  console.log('Database connection established successfully!!!!');
  app.listen(3000, () => {
    console.log('Server is successfuly listening on port 3000.....');
  });
}).catch((err) => {
  console.log('Database connection failed !!!!', err)
});
