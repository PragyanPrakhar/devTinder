const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const http = require("http");
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
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
//SignUp

//Login API

//Get Profile
const server= http.createServer(app);
initializeSocket(server);
connectDB()
    .then(() => {
        console.log("Connection Established Successfully");
        server.listen(process.env.PORT, () => {
            console.log("Server is running on port");
        });
    })
    .catch((e) => {
        console.log("Error Occured while connecting to Database !!");
    });


    // How we will configure the socket.io server in our application.
    // At first we need to require http from http
    //then we need to create server using http.createServer(app)
    //then we need to pass this server to initializeSocket function
    //initializeSocket function is defined in src/utils/socket.js
    //initializeSocket function will take server as an argument and will return io object
    //io object will be used to handle events
    // then we need to replace app.listen with server.listen.