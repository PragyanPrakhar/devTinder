const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./utils/cronjob");
// const { userAuth } = require("../src/middlewares/auth");
const cors = require("cors");
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
//SignUp

//Login API

//Get Profile

connectDB()
    .then(() => {
        console.log("Connection Established Successfully");
        app.listen(process.env.PORT, () => {
            console.log("Server is running on port");
        });
    })
    .catch((e) => {
        console.log("Error Occured while connecting to Database !!");
    });
