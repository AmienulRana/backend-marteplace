const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
    },
    nama_product: {
      type: String,
      required: true,
    },
    harga_product: {
      type: Number,
      required: [true, "Harga wajib diisi"],
    },
    category: {
      type: String,
    },
    deskripsi: {
      type: String,
    },
    stok: {
      type: Number,
      required: [true, "Stok Harus diisi"],
    },
    thumbnail: {
      type: String,
    },
    images: [
      {
        type: String,
        required: [true, "Gambar harus diisi"],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductSchema);
