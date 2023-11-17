require("dotenv").config();

const express = require("express");

const bodyParser = require("body-parser");
const { Sequelize } = require("sequelize");

const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");

const syncModels = require("./utils/syncModels");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const discountRoutes = require("./routes/discountRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const shoppingcartRoutes = require("./routes/shopping_cartRoutes");
const shoppingcartitemRoutes = require("./routes/shoppingCartItemRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderitemRoutes = require("./routes/orderItemRoutes");
const staffRoutes = require("./routes/staffRoutes");
const staffShiftRoutes = require("./routes/staffShiftRoutes");
const salaryRoutes = require("./routes/salaryRoutes");
const dineOrderRoutes = require("./routes/dineOrders");
const expensesRoutes = require("./routes/expenseRoutes");
const cloudinary = require("cloudinary");
const payment = require("./routes/paymentRoutes");

const port = process.env.PORT || 8000;
// Set up Express app
const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: '10mb',extended: true }));
app.use(bodyParser.json({limit: '10mb'}));
// app.use(express.json({ limit: '10mb' }));
// app.use(bodyParser.({ limit: '10mb', extended: true }));
app.use(
  session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// routes for

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// endpoint for models routes 
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menuitem", menuItemRoutes);
app.use("/api/payment", payment);
app.use("/api/review", reviewRoutes);
app.use("/api/discount", discountRoutes);
app.use("/api/dineorder", dineOrderRoutes);
app.use("/api/shippingaddress", shippingRoutes);
app.use("/api/shoppingcart", shoppingcartRoutes);
app.use("/api/shoppingcartitem", shoppingcartitemRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/orderitem", orderitemRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/staffshift", staffShiftRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/expense", expensesRoutes);

// sync all the models in the system
syncModels
  .syncModels()
  .then((res) => console.log("ALL GOOD"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
