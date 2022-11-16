const mongoose = require("mongoose");
const TransactionSchema = mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    ongkir_detail: {
      courier: { type: String },
      price: { type: Number },
      estimasi: { type: String },
      service_name: { type: String },
    },
    address_user: {
      nama_lokasi: { type: String },
      provinsi: { type: String },
      postal_code: {
        type: String,
      },
      country: {
        type: String,
      },
      phone_number: { type: String },
      full_address: { type: String },
    },
    product: {
      _id: {
        type: String,
        required: true,
      },
      nama_product: {
        type: String,
        require: true,
      },
      harga_product: {
        type: Number,
        require: true,
      },
      thumbnail: {
        type: String,
      },
      quantity: {
        type: Number,
        required: true,
      },
      total_harga: {
        type: Number,
      },
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", TransactionSchema);
