const Transaction = require("../model/transaction");
const Cart = require("../model/cart");
const { success, error } = require("../response");
module.exports = {
  addTransaction: async (req, res) => {
    try {
      const { _id } = req.user;
      const { ongkir_detail, address, carts } = req.body;
      carts.map(cart => cart?.products.map(async (product) => {
        const payload = {
          store_id: cart?.store_detail?._id,
          user_id: _id,
          address_user: {
            nama_lokasi: address?.nama_lokasi,
            provinsi: address?.provinsi,
            postal_code: address?.postal_code,
            country: address?.negara,
            phone_number: address?.mobile_phone,
            full_address: address?.full_address,
          },
          ongkir_detail,
          product,
          status: "Pending",
        };
        const newTransaction = new Transaction(payload);
        await newTransaction.save().then(async () => {
          await Cart.deleteOne({ user_id: _id });
        });
      }));
      return success(res, "Anda telah berhasil checkout😄");
    } catch (err) {
      return error(res, 500, "Internal Server Error");
    }
  },
  getTransaction: async (req, res) => {
    try {
      const { store_id, _id } = req.user;
      const { by } = req.query;
      if (by === "user") {
        const transaction = await Transaction.find({ user_id: _id })
          .populate({
            path: "user_id",
            select: "fullname",
          })
          .select("product.thumbnail product.nama_product status");
        return res.json(transaction).status(200);
      } else if (by === "store") {
        const transaction = await Transaction.find({ store_id })
          .populate({
            path: "user_id",
            select: "fullname",
          })
          .select("product.thumbnail product.nama_product status");
        return res.json(transaction).status(200);
      }
      return res.json([{}]).status(200);
    } catch (err) {
      return error(res, 500, "Internal Server Error");
    }
  },
  getDetailTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findOne({ _id: id }).populate(
        "user_id"
      );
      if (transaction) {
        return res.json(transaction).status(200);
      }
      return error(res, 442, "Transaksi tidak ditemukan");
    } catch (err) {
      return error(res, 500, "Internal Server Error");
    }
  },
  editStatusTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const { store_id, _id } = req.user;
      const { status } = req.query;
      if (status === "Pending") {
        return error(res, 422, "Status pending tidak bisa diterapkan saat ini");
      }
      if (status === "Selesai") {
        const transaction = await Transaction.updateOne(
          { _id: id, user_id: _id },
          { $set: { status } }
        );
        if (transaction.modifiedCount > 0) {
          return success(res, "Berhasil mengubah status transaction");
        } else {
          return error(res, 422, "Gagal mengubah status transaction");
        }
      }

      const transaction = await Transaction.updateOne(
        { _id: id, store_id },
        { $set: { status } }
      );
      if (transaction.modifiedCount > 0) {
        return success(res, "Berhasil mengubah status transaction");
      } else {
        return error(res, 422, "Gagal mengubah status transaction");
      }
    } catch (err) {
      return error(res, 500, "Internal Server Error");
    }
  },
  getAllTransactionWithoutSelected: async (req, res) => {
    try {
      const { store_id } = req.user;
      if(store_id){
        const transactions = await Transaction.find({ store_id });
        return res.status(200).json(transactions);
      }
      return res.status(200).json({ data: 'Tidak ada'});
    } catch (err) {
      return error(res, 500, "Internal Server Error");
    }
  }
};
