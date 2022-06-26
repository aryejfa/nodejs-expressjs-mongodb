const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: String,
    img: {
      data: Buffer,
      contentType: String,
      filename: String,
    },
    email: String,
    password: String,
  },
  { timestamps: true }
);
userSchema.methods.comparePassword = function (hash_password) {
  return bcrypt.compareSync(hash_password, this.password);
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
