const multer = require("multer");
module.exports = {
  storage: () => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/upload/");
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname);
      },
    });

    return storage;
  },
  allowedFiles: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|)$/)) {
      req.fileValidationError = "Only |jpg|jpeg|png file type are allowed!";
      return cb(new Error("Only |jpg|jpeg|png file type are allowed!"), false);
    }
    cb(null, true);
  },
};
