const express = require("express");

const app = express();



app.use("/test", (req, res) => {
  res.send('Nameste testing dasboard')
})

app.use("/hello", (req, res) => {
  res.send('Nameste hello dasboard')
})

app.use("/", (req, res) => {
  res.send('Nameste dasboard')
})

app.listen(3000, () => {
  console.log('Server is successfuly listening on port 3000.....');
})