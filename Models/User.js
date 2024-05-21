const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        // Check if password is at least 8 characters long
        if (password.length < 8) {
          return false;
        }
        // Check if password contains at least one alphabet and one number
        const containsAlphabet = /[a-zA-Z]/.test(password);
        const containsNumber = /[0-9]/.test(password);
        return containsAlphabet && containsNumber;
      },
      message: (props) =>
        `The password must be at least 8 characters long and contain both alphabets and numbers.`,
    },
  },
  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
