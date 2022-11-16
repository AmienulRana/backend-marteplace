const Cart = require("../model/cart");
const Product = require("../model/products");
const { success, error } = require("../response");

module.exports = {
  addToCart: async (req, res) => {
    try {
      const { id_product } = req.body;
      const { _id } = req.user;
      const productModel = await Product.findOne({ _id: id_product })
        .select("_id store_id nama_product harga_product thumbnail")
        .populate({
          path: "store_id",
          select: "_id nama_toko address",
        });
      const findMyCart = await Cart.findOne({ user_id: _id, store_detail:  productModel.store_id });
      if (findMyCart) {
        const findProductInMyCart = await Cart.findOne({
          user_id: _id,
          products: { $elemMatch: { _id: id_product } },
        });
        
        if (findProductInMyCart) {
          console.log(findMyCart)
          findProductInMyCart.products.filter(async (product) => {
            if (product._id === id_product) {
              const getProductNotUpdate = findProductInMyCart.products.filter(
                (product) => product._id !== id_product
              );
              const updateQuantityProduct = {
                ...product._doc,
                quantity: product.quantity + 1,
                total_harga: product.harga_product * (product.quantity + 1),
              };

              const newProduct = [
                updateQuantityProduct,
                ...getProductNotUpdate,
              ];
              const productWanToUpdate = await Cart.updateOne(
                { user_id: _id, store_detail:  productModel.store_id },
                {
                  $set: {
                    products: newProduct,
                  },
                }
              );
              if (productWanToUpdate.modifiedCount > 0) {
                return res.status(201).json({ error: false });
              }
            }
          });
        } else {
          const cart = await Cart.updateOne(
            { user_id: _id },
            {
              $set: {
                products: [
                  ...findMyCart.products,
                  {
                    _id: product._id,
                    nama_product: product.nama_product,
                    harga_product: Number(product.harga_product),
                    quantity: 1,
                    thumbnail: product.thumbnail,
                    total_harga: product.harga_product,
                  },
                ],
              },
            }
          );
          return success(res, "Product berhasil ditambah ke keranjang");
        }
      } else {
        const cart = new Cart({
          user_id: _id,
          products: {
            _id: productModel._id,
            nama_product: productModel.nama_product,
            harga_product: Number(productModel.harga_product),
            quantity: 1,
            thumbnail: productModel.thumbnail,
            total_harga: productModel.harga_product,
          },
          store_detail: productModel.store_id,
        });
        await cart.save();
        return success(res, "Product berhasil ditambah ke keranjang");
      }
    } catch (err) {
      console.log(err);
      return error(res, 422, "Gagal menambahkan product ke keranjang", {
        fields: err.errors,
      });
    }
  },
  getMyCart: async (req, res) => {
    try {
      const { _id } = req.user;
      const carts = await Cart.find({ user_id: _id }).populate({
        path: "store_detail",
        select: "_id nama_toko address",
      });
        return res.status(200).json(carts);
    } catch (err) {
      console.log(err);
      return error(
        res,
        422,
        "Gagal Mengambil product | Internal Server error",
        {
          fields: err.errors,
        }
      );
    }
  },
  deleteToCart: async (req, res) => {
    try {
      const { id } = req.params;
      const { _id } = req.user;
      const productModel = await Product.findOne({ _id: id })
      .select("_id store_id nama_product harga_product thumbnail")
      .populate({
        path: "store_id",
        select: "_id nama_toko address",
      });
    const findProductInMyCart = await Cart.findOne({ user_id: _id, store_detail:  productModel.store_id });
      if (findProductInMyCart) {
        const getProductNotDelete = findProductInMyCart.products.filter(
          (product) => product._id !== id
        );
        findProductInMyCart.products.filter(async (product) => {
          if (product._id === id && product.quantity !== 1 ) {
            const updateQuantityProduct = {
              ...product._doc,
              quantity: product.quantity - 1,
              total_harga: product.harga_product * (product.quantity - 1),
            };
            const newProduct = [
              updateQuantityProduct,
              ...getProductNotDelete,
            ];
            const productWanToUpdate = await Cart.updateOne(
              { user_id: _id },
              {
                $set: {
                  products: newProduct,
                },
              }
            );
            if (productWanToUpdate.modifiedCount > 0) {
              return res.status(200).json({ error: false });
            }
          }
          else if(product._id === id && product.quantity === 1) {
            if(getProductNotDelete.length === 0){
              const deleteCart = await Cart.deleteOne({ user_id: _id, store_detail:  productModel.store_id });
              console.log(deleteCart)
              if(deleteCart.deletedCount > 0){
                return success(res, 'Berhasil menghapus product')
              }
            }
            const productWanToUpdate = await Cart.updateOne(
              { user_id: _id },
              {
                $set: {
                  products: getProductNotDelete,
                },
              }
            );
            if (productWanToUpdate.modifiedCount > 0) {
              return res.status(200).json({ error: false });
            }
          }
        });
      } 
    } catch (err) {
      console.log(err);
      return error(
        res,
        500,
        "Gagal Menghapus product | Internal Server error",
        {
          fields: err.errors,
        }
      );
    }
  },
  checkout: async (req, res) => {
    try {
    } catch (error) {}
  },
};
