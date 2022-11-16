const mongoose = require("mongoose");
const StoreSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  nama_toko: {
    type: String,
    required: [true, "Nama toko wajib diisi"],
  },
  category: {
    type: String,
    required: [true, "Category wajib diisi"],
  },
  status_toko: {
    type: String,
    enum: ["aktif", "non-aktif"],
    default: "aktif",
  },
  address: {
    nama_lokasi: { type: String },
    provinsi: { type: String },
    provinsi_id: { type: String },
    lokasi_id: { type: String },
    postal_code: { type: String },
  },
  mobile_phone: {
    type: String,
  },
});
StoreSchema.index({ email: 1 });

module.exports = mongoose.model("store", StoreSchema);
