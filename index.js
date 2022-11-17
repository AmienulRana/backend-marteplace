const express = require("express");
const app = express();
require("dotenv").config();
require("./db");
const userRoute = require("./routes/users");
const ProductsRoute = require("./routes/products");
const StoreRoute = require("./routes/store");
const CartRoute = require("./routes/cart");
const TransactionRoute = require("./routes/transaction");
const cors = require("cors");
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "public/uploads")));

app.use('/', (req, res) => res.json({ message: "Welcome to Marketplace API"}))

const api_version = "api/v1";

app.use(`/${api_version}/user`, userRoute);
app.use(`/${api_version}/cart`, CartRoute);
app.use(`/${api_version}/products`, ProductsRoute);
app.use(`/${api_version}/store`, StoreRoute);
app.use(`/${api_version}/transaction`, TransactionRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server start running on port ${process.env.PORT}`);
});
