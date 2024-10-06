const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const authRouter = express.Router();
const validator = require("validator");
// const bcrypt=require("bcrypt");
const cookieParser = require("cookie-parser");
const { signUpValidation } = require("../utils/validation");
app.use(express.json());
app.use(cookieParser());
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            //token generation
            /* const token = await jwt.sign({ _id: user._id }, "dev@123", {
                expiresIn: "1d",
            }); */
            const token = await user.getJWT();
            // console.log(token);
            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send(user);
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

authRouter.post("/logout", (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("User LoggedOut Successfully");
});
module.exports = authRouter;
