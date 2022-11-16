const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
  store_detail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "store",
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  products: [
    {
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
  ],
  status: {
    type: String,
  },
});

module.exports = mongoose.model("cart", CartSchema);
