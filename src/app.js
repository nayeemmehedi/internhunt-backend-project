const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { signupRoutes } = require("./routes/authentication.routes.js");
const { companyRoutes } = require("./routes/company.routes.js");
const { internRoutes } = require("./routes/intern.routes.js");

dotenv.config();

const app = express();


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static("public/temp"))

app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(cookieParser());


app.get("/",(req, res) => {
  res.send("Welcome");
});


//   app.get("/api",userVerify,(req, res) => {
//   res.send("Welcome");
// });



app.use("/api/v1", signupRoutes)
app.use("/api/v1/company", companyRoutes)
app.use("/api/v1/intern", internRoutes)



// app.use("/api/v1/payment", paymentRoutes)
// app.use("/api/v1/product", productRoutes)
// app.use("/api/v1/buy", buyProduct)



module.exports = app 