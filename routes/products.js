const express = require("express");
const {
  addProduct,
  getProduct,
  getDetailProduct,
  editProduct,
  getNewProduct,
  deleteProduct,
} = require("../controller/products");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticationToken } = require("../middleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    // You could rename the file name
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  const typeFile = file.mimetype;
  if (
    typeFile === "image/png" ||
    typeFile === "image/jpg" ||
    typeFile === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    new Error("Yang anda upload bukan gambar!");
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1000000 },
});

router.post("/", authenticationToken, upload.array("images", 4), addProduct);
router.get("/", authenticationToken, getProduct);
router.get("/new-products", getNewProduct);
router.get("/:id", getDetailProduct);
router.put("/:id", authenticationToken, upload.array("images", 4), editProduct);
router.delete("/:id", authenticationToken, deleteProduct);

module.exports = router;
