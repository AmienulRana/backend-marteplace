const { error, success } = require("../response");
const jwt = require("jsonwebtoken");
module.exports = {
  authenticationToken: (req, res, next) => {
    const header = req.headers["authorization"];
    if (header === undefined)
      return error(res, 410, "Please Login to get Access!!", { auth: false });
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        console.log(err);
        return error(
          res,
          401,
          "Invalid Authentication, Silahkan login kembali!",
          {
            auth: false,
          }
        );
      }
      req.user = decoded;
      next();
    });
  },
};
