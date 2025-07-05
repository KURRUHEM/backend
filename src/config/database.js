const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb+srv://nodetutorial:NJf209e0NHulyKyE@nodetutorial.wxyafkx.mongodb.net/nodepractise")
}

module.exports = {
  connectDB
}
