const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const adminAuth = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use("/students", adminAuth, require("./routes/students"));
app.use("/courses", adminAuth, require("./routes/courses"));
app.use("/enrollments", adminAuth, require("./routes/enrollments"));

app.get("/", adminAuth, (req, res) => {
  res.render("admin");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


