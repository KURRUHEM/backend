const mongoose = require('mongoose');
const { isEmail, isStrongPassword, isURL } = require('validator');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 25
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 25
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Invalid email format ");
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 8,
      maxLength: 16,
      validate(value) {
        if (!isStrongPassword(value)) {
          throw new Error("Password doesn't meet criteria !!")
        }
      }
    },
    age: {
      type: Number,
      required: true,
      age: 18
    },
    gender: {
      type: String,
      required: true,
      validate(value) {
        if (!['Male', 'Female', 'Others'].includes(value)) {
          throw new Error("Gender data is not valid !!!");
        }
      }
    },
    photoUrl: {
      type: String,
      default: "",
      validate(value) {
        if (value && !isURL(value)) {
          throw new Error('Invalid Url !!!')
        }
      }
    },
    about: {
      type: String,
      trim: true,
      default: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
    },
    skills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);