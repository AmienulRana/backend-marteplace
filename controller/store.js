const Store = require("../model/store");
const User = require("../model/users");
const { success, error } = require("../response");

module.exports = {
  getStore: async (req, res) => {
    try {
      const { _id } = req.user;
      const store = await Store.findOne({ user_id: _id });
      return res.status(200).json(store);
    } catch (err) {
      console.log(err);
      return error(res, 500, "Internal server error");
    }
  },
  editStore: async (req, res) => {
    try {
      const { _id } = req.user;
      const {
        store_name,
        category,
        address: { province, province_id, city_id, location, postalCode },
        mobile_phone,
        store_status,
      } = req.body;
      console.log(req.body)
      const findStore = await Store.findOne({ user_id: _id });
      if (!findStore) {
        const addStore = new Store({
          user_id: _id,
          nama_toko: store_name,
          address: {
            nama_lokasi: location,
            provinsi: province,
            provinsi_id: province_id,
            lokasi_id: city_id,
            postal_code: postalCode,
          },
          mobile_phone,
          category,
          status_toko: store_status,
        });
        await addStore.save();
        return success(res, "Berhasil Menambahkan data");
      } else {
        const store = await Store.updateOne(
          { user_id: _id },
          {
            $set: {
              nama_toko: store_name,
              address: {
                nama_lokasi: location,
                provinsi: province,
                provinsi_id: province_id,
                lokasi_id: city_id,
                postal_code: postalCode,
              },
              mobile_phone,
              category,
              status_toko: store_status,
            },
          }
        );
        if (store.modifiedCount > 0) {
          return success(res, "Berhasil mengubah data");
        }
      }
      return error(res, 422, "Tidak Ada data yang berubah");
    } catch (err) {
      console.log(err);
      return error(res, 422, "Internal server error | Gagal mengubah data");
    }
  },
};
