const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { signUpValidation } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../src/middlewares/auth");
app.use(express.json());
app.use(cookieParser());

//SignUp
app.post("/signup", async (req, res) => {
    try {
        //validation
        signUpValidation(req);

        const { firstName, lastName, email, password } = req.body;
        //Hashing a password
        const HashedPassword = await bcrypt.hash(password, 10);
        console.log(HashedPassword);
        const user = new User({
            firstName,
            lastName,
            email,
            password: HashedPassword,
        });

        await user.save();
        res.send("User Added Successfully !!");
    } catch (e) {
        res.status(400).send("Error saving the user" + e.message);
    }
});

//Login API
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate whether the email id provided by the user is valid or not.
        if (!validator.isEmail(email)) {
            throw new Error("Not a valid email");
        }

        //Check whether the email is present or not in the database
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        //Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            //token generation
            const token = await jwt.sign({ _id: user._id }, "dev@123", {
                expiresIn: "1d",
            });
            console.log(token);
            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("User Login Successful");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

//Get Profile
app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);

        // console.log(cookies);
        // res.send("reading cookies");
    } catch (error) {
        res.send("ERROR: " + error.message);
    }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
    console.log("Sending a connection request");
    res.send("Connection Request sent");
});

connectDB()
    .then(() => {
        console.log("Connection Established Successfully");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((e) => {
        console.log("Error Occured while connecting to Database !!");
    });
