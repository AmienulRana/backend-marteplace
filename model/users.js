const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Nama lengkap harus diisi"],
  },
  email: {
    type: String,
    required: [true, "Email harus diisi"],
  },
  password: {
    type: String,
    required: [true, "Password harus diisi"],
  },
  nama_toko: {
    type: String,
  },
  category: {
    type: String,
  },
});
UserSchema.index({ email: 1 });
module.exports = mongoose.model("users", UserSchema);
