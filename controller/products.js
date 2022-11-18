const fs = require("fs");
const { error, success } = require("../response");
const Product = require("../model/products");

module.exports = {
  getNewProduct: async (req, res) => {
    try {
      const products = await Product.find().select(
        "_id nama_product harga_product images store_id"
      );
      const newProducts = products.reverse().splice(0, 9);
      return res.status(200).json(newProducts);
    } catch (err) {
      return error(res, 422, "Gagal menampilkan product");
    }
  },
  getProduct: async (req, res) => {
    try {
      const { store_id } = req.user;
      const products = await Product.find({ store_id: store_id });
      return res.status(200).json(products);
    } catch (error) {
      return error(res, 422, "Gagal menampilkan product", {
        fields: err.errors,
      });
    }
  },
  addProduct: async (req, res) => {
    try {
      const { store_id } = req.user;

      if (req.files.length > 0 && req.files.length <= 4) {
        const images = req.files.map((file) => `${file.filename}`);
        const product = new Product({
          ...req.body,
          store_id: store_id,
          images,
          thumbnail: images[0],
        });

        await product.save();
        return success(res, "Berhasil menambahkan product baru");
      } else if (req.files.length > 4) {
        return error(res, 422, "Maximal image yang anda upload  harus 4");
      }
      return error(res, 422, "Anda harus mengupload image product");
    } catch (err) {
      console.log(err);
      if (req?.files?.length > 0) {
        req.files.map((file) => {
          fs.unlinkSync(`public/uploads/${file.filename}`);
        });
      }
      return error(res, 422, "Gagal Menambahkan product", {
        fields: err.errors,
      });
    }
  },
  getDetailProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const products = await Product.findOne({ _id: id }).populate({
        path: "store_id",
        // select: "address nama_toko",
      });
      if (products) {
        return res.status(200).json(products);
      }
      return error(res, 404, "Product yang anda cari tidak ditemukan");
    } catch (err) {
      return error(res, 422, "Gagal menampilkan product", {
        fields: err.errors,
      });
    }
  },
  editProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { id: user_id } = req.user;
      let { deleting_images } = req.body;
      const parsing_deleting_image = JSON.parse(deleting_images);

      const product = await Product.findOne({ _id: id, user_id });

      if (parsing_deleting_image.length > 0) {
        product?.images?.filter((image, i) => {
          parsing_deleting_image.map((img) => {
            if (image === img) {
              product.images.splice(i, 1);
              fs.access(`public/uploads/${img}`, fs.constants.F_OK, (err) => {
                if (!err) {
                  fs.unlinkSync(`public/uploads/${img}`);
                }
              });
            }
          });
        });
      }

      if (req.files.length === 0) {
        const updateProduct = await Product.updateOne(
          { _id: id },
          {
            $set: {
              ...req.body,
              images: product?.images,
            },
          }
        );
        if (updateProduct.modifiedCount > 0) {
          return success(res, "Berhasil merubah product");
        }
      } else {
        if (product?.images.length > 4) {
          return error(res, 442, "Maximal image yang anda upload  harus 4");
        }
        const newImages = req?.files?.map((file) => file.filename);
        const images = [...product?.images, ...newImages];
        const updateProduct = await Product.updateOne(
          { _id: id },
          {
            $set: {
              ...req.body,
              images,
            },
          }
        );
        if (updateProduct.modifiedCount > 0) {
          return success(res, "Berhasil merubah product");
        }
      }
      return error(res, 422, "Tidak ada ada product yang berubah");
    } catch (err) {
      if (req?.files?.length > 0) {
        req.files.map((file) => {
          fs.unlinkSync(`public/uploads/${file.filename}`);
        });
      }
      return error(res, 422, "Gagal Merubah product | Server Error 500");
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const findProduct = await Product.findOne({ _id: id });
      const product = await Product.deleteOne({ _id: id });
      if (!findProduct) {
        return error(res, 404, "Product yang anda hapus tidak ditemukan");
      }
      if (product.deletedCount > 0) {
        findProduct.images.map((file) => {
          fs.unlinkSync(`public/uploads/${file}`);
        });
        return success(res, "Berhasil Menghapus product");
      }
    } catch (err) {
      return error(res, 500, "Gagal Menghapus product | Server Error 500");
    }
  },
};
