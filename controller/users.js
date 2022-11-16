const Users = require("../model/users");
const { error, success } = require("../response");
const bcrypt = require("bcrypt");
const Store = require("../model/store");
const generate_token = require("../utils/generateToken");
const axios = require("axios");
const { request } = require("express");

module.exports = {
  register: async (req, res, next) => {
    try {
      let { email, password, openAStore, nama_toko, category, fullname } =
        req.body;
      if (!fullname || fullname.length === 0) {
        return error(res, 422, "Fullname harus diisi");
      }
      if (!email) {
        return error(res, 422, "Email harus diisi");
      }
      const checkDuplicateEmail = await Users.findOne({ email });
      if (checkDuplicateEmail) {
        return error(res, 422, "Email anda telah digunakan");
      }
      if (password.length <= 8) {
        return error(res, 422, "Password anda harus lebih dari 8 karakter");
      }
      password = bcrypt.hashSync(password, 10);
      const user = new Users({ email, password, fullname });
      user.save(async function (err) {
        if (err) throw err;
        if (openAStore) {
          if (!nama_toko || nama_toko.length === 0) {
            return error(res, 422, "Nama toko anda harus diisi");
          }
          const store = new Store({ nama_toko, category, user_id: user._id });
          await store.save();
        }
      });

      return success(res, "Registrasi berhasil, silahkan Login");
    } catch (err) {
      if (err && err.name === "ValidationError") {
        return error(res, 422, err.message);
      }
      next(err);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (user) {
        const store = await Store.findOne({ user_id: user._id });
        const data = {
          _id: user._id,
          fullname: user.fullname,
          store_id: store?._id,
          email: user.email,
        };
        const cek_password = bcrypt.compareSync(password, user.password);
        if (!cek_password)
          return error(res, 401, "Password atau email anda salah");

        const token = await generate_token(data);
        return success(res, "Authentication sukses", { token, error: false });
      }
      return error(res, 401, "Email yang anda masukan tidak terdaftar");
    } catch (err) {
      console.log(err);
      return error(res, 422, {
        error: true,
        message: err.message,
        fields: err.errors,
      });
    }
  },
  checkOngkir: async (req, res) => {
    try {
      const { from, to, courier } = req.body;
      console.log(req.body);
      const options = {
        method: "POST",
        url: "https://api.rajaongkir.com/starter/cost",
        headers: {
          key: "88e27259810cfb4edeb15cdf1554cea3",
          "content-type": "application/x-www-form-urlencoded",
        },
        data: {
          origin: from,
          destination: to,
          weight: 300,
          courier,
        },
      };
      const response = await axios(options);
      return success(res, "", response?.data);
    } catch (err) {
      console.log(err.response.data.rajaongkir);
      return res.status(400).json(err.response);
    }
  },
};
